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
        private IPayrollDataService _dataService;
        private IPayrollValidationService _validationService;
        private IPayrollShiftService _shiftService;
        private IUserService _userService;

		public PayrollService(IUserService userService, IPayrollValidationService validationService,
            IPayrollDataService dataService, IPayrollShiftService shiftService)
		{
            _dataService = dataService;
            _shiftService = shiftService;
            _userService = userService;
			_validationService = validationService;
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
			ts.Shifts = _shiftService.BookingsToShifts(weekCommencing, weekCommencing.AddDays(6), ts.Bookings, ts.CarerCode);

			// TODO Overlay Annual Leave and Sickness Absence on Scheduled Availability for truer picture?

            return ts;
        }

        public ICollection<Summary> GetAdjustedSummaries(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
            List<Summary> summaries = _dataService.GetSummaries(teamCode, periodStart, periodEnd).ToList();

            summaries.ForEach(sum => {
                // Get calculated shift times etc
                var shifts = _shiftService.BookingsToShifts(periodStart, periodEnd,
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
            // Validation
            // - Unmapped Booking Types (Default to Hours Paid/OT10?)
            // - No contract for default team

            string logFile = "C:\\Dev\\PayrollDataLog.csv";
            if (File.Exists(logFile)) File.Delete(logFile);
            File.AppendAllText(logFile, $"Carer,Position,ContractMins,Total Mins,Hours,AddHours\n");

            ICollection<Payroll> data = new List<Payroll>();
            List<Carer> carers = _dataService.GetCarersByTeam(teamCode, periodStart).ToList();
            List<PayrollCodeMap> codeMap = new List<PayrollCodeMap>(_dataService.GetPayrollCodeMap());

            carers.ForEach(car =>
            {
                ICollection<CarerContract> contracts = _dataService.GetContracts(car.CarerCode, periodStart);
                ICollection<CarerBooking> bookings = _dataService.GetBookings(car.CarerCode, periodStart, periodEnd);

                if (bookings.Count > 0)     // TODO Consider if there are any scenarios where valid payroll but no bookings
                {
                    int seq = 1;

                    ICollection<Shift> shifts = _shiftService.BookingsToShifts(periodStart, periodEnd, bookings, car.CarerCode);
                    //ICollection<Adjustment> adjs = adjusts.Where(adj => adj.CarerCode == car.CarerCode
                    //    && adj.Authorised != null).ToList();

                    // We don't use the summaries here because they aren't broken down by Contract
                    // We may want to refactor the Summaries to be an aggregation of the Contract aggregations

                    // Extract Positions
                    List<short> positions = shifts
                        .SelectMany(sh => contracts.Select(cn => cn.CarerGradeCode)).Distinct().ToList();

                    // Default to first available (arbitrary) if no designated primary position
                    CarerContract primaryContract = contracts.FirstOrDefault(cn => cn.TeamCode == car.DefaultTeamCode)
                        ?? contracts.FirstOrDefault();
                    short primaryPosition = primaryContract.CarerGradeCode;
                    
                    // Aggregate over position
                    List<PayrollAggregate> aggs = positions.Select(pos => new PayrollAggregate()
                        {
                            Carer = car,
                            CarerGrade = pos,
                            // TODO Check these shifts include authorised adjustments
                            ActualAdjustedMins = shifts.Where(sh => contracts
                                .Where(cn => cn.CarerGradeCode == pos).Select(cn => cn.ContractCode).ToList().Contains(sh.ContractCode ?? 0))
                                    .Sum(sh => sh.ShiftMins)
                        })
                        .ToList();

                    // Add a default position entry if one does not exist - can strip out later if zero
                    // TODO And, uh, if they don't have one?
                    if (!aggs.Any(agg => agg.CarerGrade == primaryPosition))
                    {
                        aggs.Add(new PayrollAggregate()
                        {
                            Carer = car,
                            CarerGrade = primaryPosition,
                            ActualAdjustedMins = 0
                        });
                    }

                    // Adjust for non-default contract time (down to zero min)
                    double defaultTime = aggs.FirstOrDefault(agg => agg.CarerGrade == primaryPosition).ActualAdjustedMins;
                    double nonDefaultTime = aggs.Where(agg => agg.CarerGrade != primaryPosition)
                        .Sum(agg => agg.ActualAdjustedMins);
                    double contractTime = contracts.Max(cn => cn.ContractMins) * 52 / 12;
                    if (nonDefaultTime > 0) aggs.FirstOrDefault(agg => agg.CarerGrade == primaryPosition)
                        .ActualAdjustedMins = defaultTime - (nonDefaultTime > contractTime ? contractTime : nonDefaultTime);

                    // Get OT Hours (Actual-Contract)
                    double addTime = (defaultTime + nonDefaultTime - contractTime);

                    // Build output
                    if (addTime > 0)
                    {
                        aggs.ForEach(agg =>
                        {
                            data.Add(new Payroll()
                            {
                                StaffMember = car.PersonnelNumber,
                                Date = periodEnd.AddDays(1),
                                Sequence = seq,
                                NEPay = "N",
                                Code = "OT10",
                                Hours = addTime / 60
                            });

                            seq++;

                            File.AppendAllText(logFile, $"{car.Forename} {car.Surname},{agg.CarerGrade},{contractTime},{agg.ActualAdjustedMins},{agg.ActualAdjustedMins / 60},{(agg.ActualAdjustedMins - contractTime < 0 ? 0 : agg.ActualAdjustedMins - contractTime) / 60}\n");
                        });
                    }

                    // Get Instance Code Bookings (SleepOver, NightPremium, On-Call)
                    List<CarerBooking> inst = bookings.Where(bk => InstMapForBooking(bk, codeMap) != null).ToList();

                    // Aggregate Count by Instance Code
                    inst.Select(ins => InstMapForBooking(ins, codeMap)).Distinct().ToList().ForEach(map =>
                    {
                        data.Add(new Payroll()
                        {
                            StaffMember = car.PersonnelNumber,
                            Date = periodEnd.AddDays(1),
                            Sequence = seq,
                            NEPay = "N",
                            Code = map.Code,
                            Hours = inst.Count(ins => InstMapForBooking(ins, codeMap) == map)
                        });

                        seq++;
                    });

                    // Strip out any aggregate records with zero time
                }

            });

            return data;
		}

        private PayrollCodeMap InstMapForBooking(CarerBooking bk, List<PayrollCodeMap> codeMap)
        {
            return codeMap.FirstOrDefault(map => (map.PayInstance ?? false)
                && ((map.Type == 0 && map.TypeCode == bk.BookingType)
                || (map.Type == 1 && map.TypeCode == bk.AvailType)));
        }
    }
}