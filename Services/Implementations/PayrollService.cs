namespace Blackwood.Access.Services
{
    using System;
    using System.IO;
    using System.Collections.Generic;
    using System.Linq;
    using Models;
    using System.Security.Claims;

    public class PayrollService : IPayrollService
    {
		// TODO - Replace these two with PayrollCodeMap entries
		private int[] _absenceCodes = { 108, 109 };
		private int[] _unpaidCodes;

        private IPayrollDataService _dataService;
        private IPayrollValidationService _validationService;
        private IUserService _userService;

		public PayrollService(IUserService userService, IPayrollValidationService validationService,
            IPayrollDataService dataService)
		{
            _dataService = dataService;
            _userService = userService;
			_validationService = validationService;
			
			_unpaidCodes = _dataService.GetPayrollCodeMap()
				.Where(map => map.Type == 0 && !map.PayHours).Select(map => map.TypeCode).ToArray();
			// TODO Do something similar for _absenceCodes?
		}


        public Timesheet GetTimesheet(int carerCode, DateTime weekCommencing)
        {
			Carer carer = _dataService.GetCarers().FirstOrDefault(c => c.CarerCode == carerCode);

			Timesheet ts = new Timesheet()
			{
				CarerCode = carer.CarerCode,
				WeekCommencing = weekCommencing,
				Carer = carer
			};

            // CarerContracts
            ts.Contracts = _dataService.GetContracts(carerCode, weekCommencing);

			bool isContracted = ts.Contracts.Any(c => c.ContractMins > 0);

            // ScheduledAvailability
            ts.ScheduledAvailability = _dataService.GetScheduledAvailability(carerCode, weekCommencing);

            // ActualAvailability
            ts.ActualAvailability = _dataService.GetActualAvailability(carerCode, weekCommencing);

			// Remove Scheduled Availability on Actual Availability Days
			ts.ActualAvailability.Select(aa => aa.ThisStart.Date).Distinct().ToList().ForEach(dt => {
				ts.ScheduledAvailability.Where(sa => sa.ThisStart.Date == dt).ToList().ForEach(sa => {
					ts.ScheduledAvailability.Remove(sa);
				});
			});

			// CarerBookings
			ts.Bookings = _dataService.GetBookings(carerCode, weekCommencing, weekCommencing.AddDays(6));

            // Adjustments
            ts.Adjustments = _dataService.GetTimesheetAdjustments(carerCode, weekCommencing, weekCommencing.AddDays(6)).ToList();

			// Transform Bookings -> Shifts
			ts.Shifts = BookingsToShifts(weekCommencing, weekCommencing.AddDays(6), ts.Bookings, ts.CarerCode);

			// TODO Overlay Annual Leave and Sickness Absence on Scheduled Availability for truer picture?

            return ts;
        }

		// Establish Shifts for each day in period
		// Definitions:
		// A Shift is a block of contiguous time within an Availability block which contains one or more Bookings
		// The Shift starts at the beginning of the Availability block or the first Booking, which ever is earliest
		// The Shift finishes at the end of the end of the last booking in that Shift, if the first Shift
		// The Shift finishes at the end of the Availability block if the second Shift 
		// A Shift which contains a gap of two hours or more should be split into two Shifts
		// !But only if at least part of that gap falls between 2PM and 4PM!
		// The first Shift ends at the end of the last Booking before the split
		// The second Shift begins at the beginning of the first booking after the split
		// The actual hours paid are counted from the beginning of the Shift to the finish of it
		// Any Shift of four hours or more is deducted thirty minutes as an unpaid break
		private ICollection<Shift> BookingsToShifts(DateTime startDate, DateTime finishDate, ICollection<CarerBooking> bookings, int carerCode)
		{
			List<DateTime> dates = Enumerable.Range(0, (finishDate - startDate).Days + 1).Select(d => startDate.AddDays(d)).ToList();
			List<Shift> shifts = new List<Shift>();

			dates.ForEach(dt => {
				TimeSpan gap;
				int day = dates.IndexOf(dt);

				// First Shift of this day
				Shift shift = new Shift() { CarerCode = carerCode, Sequence = 1, Day = day, UnpaidMins = 0,
					BiggestGap = 0 };

				bookings.Where(bk => bk.ThisStart.Date == dt && !_absenceCodes.Any(ac => ac == bk.BookingType))
					.OrderBy(bk => bk.ThisStart).ToList().ForEach(bk => {

					// Calculate gap from last booking and adjust Shift Start/Finish times
					gap = (bk.ThisStart - shift.Finish) ?? TimeSpan.FromMinutes(0);
					shift.BiggestGap = Math.Max(gap.Minutes, shift.BiggestGap);
					shift.ContractCode = shift.ContractCode ?? bk.ContractCode;
					shift.Start = shift.Start ?? bk.ThisStart;

					//  Check for Unpaid Break Booking Type
					if (_unpaidCodes.Any(uc => uc == bk.BookingType))
					{
						shift.UnpaidMins += (bk.ThisMins);
					}
					// Begin new Shift if valid shift break detected or team changes
					if (gap >= TimeSpan.FromHours(2)
						// && ((bk.ThisStart.Hour >= 14 && bk.ThisStart.Hour <= 16) 
						// 	|| (bk.ThisFinish.Hour >= 14 && bk.ThisFinish.Hour <= 16 )))
						|| bk.ContractCode != shift.ContractCode)
					{
						// Check that Shift had valid break and Add Adjusment if not
                        // TODO Implement BreakPolicy, with legal minimums by default
                        if (shift.ShiftMins >= 360 && shift.UnpaidMins < 20)
                        {
                            // TODO Add an Adjustment or just increment UnpaidMins?
                        }

						// Get ShiftBreak profile
						shifts.Add(shift);
						shift = new Shift() {
							CarerCode = carerCode,
							Sequence = shifts.Where(sh => sh.Day == day).Select(sh => sh.Sequence).Max() + 1,
							Day = day,
							Start = bk.ThisStart,
							ContractCode = bk.ContractCode,
							BiggestGap = 0
						};
					}
					else
					{
						shift.Finish = bk.ThisFinish;
						// Shift time from beginning to end minus unpaid breaks
						shift.ShiftMins = (int)((shift.Finish - shift.Start).Value.TotalMinutes) - shift.UnpaidMins;
					}

					// Tag Booking with Shift Sequence
					bk.Shift = shift.Sequence;
				});
				shifts.Add(shift);
			});

			// Strip out blank Shifts
			shifts = shifts.Where(sh => sh.Start != null && sh.Finish != null).ToList();

			return shifts;
		}

        public ICollection<Summary> GetAdjustedSummaries(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
            List<Summary> summaries = _dataService.GetSummaries(teamCode, periodStart, periodEnd).ToList();

            summaries.ForEach(sum => {
                // Get calculated shift times etc
                var shifts = BookingsToShifts(periodStart, periodEnd,
					_dataService.GetBookings(sum.CarerCode, periodStart, periodEnd), sum.CarerCode);
				sum.ActualMins = shifts.Sum(sh => sh.ShiftMins);
                sum.UnpaidMins = shifts.Sum(sh => sh.UnpaidMins);
                // Apply adjustments to shift times
                var adjusts = _dataService.GetTimesheetAdjustments(sum.CarerCode, periodStart, periodEnd);
                sum.ActualMins = sum.ActualMins + adjusts.Where(adj => adj.Authorised != null)
					.Sum(adj => (adj.Hours * 60) + adj.Mins);
			});
            return summaries;
		}

		// TODO Consider renaming this method since it's being used for upserts
		public Adjustment PutTimesheetAdjustment(Adjustment adj, ClaimsPrincipal user)
		{
            adj.RequestedBy = _userService.GetUserInfo(user).AccountName;
            adj.Requested = DateTime.Now;

            _dataService.PutTimesheetAdjustment(adj);

			return _dataService.GetAllAdjustments().FirstOrDefault(a => a.Guid == adj.Guid);
		}

		public ICollection<Payroll> GetPayrollData(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
            string logFile = "C:\\Dev\\PayrollDataLog.csv";
            if (File.Exists(logFile)) File.Delete(logFile);
            File.AppendAllText(logFile, $"Carer,Team,Total Mins\n");

            ICollection<Payroll> data = new List<Payroll>();

            ICollection<Summary> summaries = _dataService.GetSummaries(teamCode, periodStart, periodEnd);
            ICollection<Adjustment> adjusts = _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodEnd);

            // Validation
            // - Unmapped Booking Types (Default to Hours Paid/OT10?)
            // - No contract for default team

            // Get Carers for Payroll run
            // TODO We are probably looking to narrow this down to only carers who are DEFAULT for this Team
			// Q: If someone works in more than one team, is it always the default team that submits data?
            List<Carer> carers = _dataService.GetCarersByTeam(teamCode, periodStart).ToList();

            carers.ForEach(car =>
            {
                ICollection<CarerContract> contracts = _dataService.GetContracts(car.CarerCode, periodStart);
                ICollection<CarerBooking> bookings = _dataService.GetBookings(car.CarerCode, periodStart, periodEnd);

                if (bookings.Count > 0)     // TODO Consider if there are any scenarios where valid payroll but no bookings
                {
                    ICollection<Shift> shifts = BookingsToShifts(periodStart, periodEnd, bookings, car.CarerCode);
                    ICollection<Adjustment> adjs = adjusts.Where(adj => adj.CarerCode == car.CarerCode
                        && adj.Authorised != null).ToList();

                    // We don't use the summaries here because they aren't broken down by Contract/Team
                    // We may want to refactor the Summaries to be an aggregation of the Contract/Team aggregations

                    // Extract CostCenters & Build Aggregation List
                    // TODO Refactor again to aggregate against Position (i.e. Grade)
                    List<string> costCentres = shifts
                        .Select(sh => contracts.FirstOrDefault(cn => sh.ContractCode == cn.ContractCode).CostCentre)
                        .Distinct().ToList();
					
					CarerContract primaryContract = contracts.FirstOrDefault(cn => cn.TeamCode == car.DefaultTeamCode);
					if (primaryContract == null)
					{
						
					}
                    string primaryCostCentre = primaryContract.CostCentre;

                    List<PayrollAggregate> aggs = costCentres.Select(cc => new PayrollAggregate()
                    {
                        Carer = car,
                        CostCentre = cc,
                        // TODO Check these shifts include authorised adjustments
                        ActualAdjustedMins = shifts.Where(sh => contracts
                            .Where(cn => cn.CostCentre == cc).Select(cn => cn.ContractCode).ToList().Contains(sh.ContractCode ?? 0))
                                .Sum(sh => sh.ShiftMins)
                    }).ToList();

                    // Add a default area entry if one does not exist - can strip out later if zero
                    // TODO And, uh, if they don't have one?
                    if (!aggs.Any(agg => agg.CostCentre == primaryCostCentre))
                    {
                        aggs.Add(new PayrollAggregate()
                        {
                            Carer = car,
                            CostCentre = primaryCostCentre,
                            ActualAdjustedMins = 0
                        });
                    }

                    // Adjust for non-default area time (down to zero min)
                    double defaultTime = aggs.FirstOrDefault(agg => agg.CostCentre == primaryCostCentre).ActualAdjustedMins;
                    double nonDefaultTime = aggs.Where(agg => agg.CostCentre != primaryCostCentre)
                        .Sum(agg => agg.ActualAdjustedMins);
                    double contractTime = contracts.Max(cn => cn.ContractMins) * 52 / 12;
                    if (nonDefaultTime > 0) aggs.FirstOrDefault(agg => agg.CostCentre == primaryCostCentre)
                        .ActualAdjustedMins = defaultTime - (nonDefaultTime > contractTime ? contractTime : nonDefaultTime);

                    aggs.ForEach(agg =>
                    {
                        File.AppendAllText(logFile, $"{car.Forename} {car.Surname},{agg.CostCentre},{agg.ActualAdjustedMins}\n");
                    });

                    // Get OT Hours (Actual-Contract)

                    // Get Unit Code Info (SleepOver & NightPremium)

                    // Strip out any aggregate records with zero time
                }

            });

            return data;
		}
    }
}