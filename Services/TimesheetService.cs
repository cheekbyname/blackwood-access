namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using Models;
    using Microsoft.EntityFrameworkCore;

    public class TimesheetService : ITimesheetService
    {
		private static int[] _absenceCodes = { 108, 109 };
		private static int[] _unpaidCodes = { 123, 110, 98 };
		private AccessContext _context;

		public TimesheetService(AccessContext context)
		{
			_context = context;
		}

		public IEnumerable<Team> GetTeams()
		{
            return _context.Set<Team>().FromSql("GetTeams").OrderBy(t => t.TeamDesc).ToList();
			//return _context.Teams.OrderBy(c => c.TeamDesc).ToList();
		}
        public IEnumerable<Carer> GetCarers()
        {
			return _context.Carers.OrderBy(c => c.Forename).ThenBy(c => c.Surname).ToList();
        }

		public IEnumerable<Carer> GetCarersByTeam(int TeamCode)
		{
			return _context.Set<Carer>().FromSql("GetCarersByTeam @TeamCode", new SqlParameter("@TeamCode", TeamCode)).ToList()
				.OrderBy(c => c.Forename).ThenBy(c => c.Surname);
		}

        public Timesheet GetTimesheet(int carerCode, DateTime weekCommencing)
        {
			Carer carer = _context.Carers.FirstOrDefault(c => c.CarerCode == carerCode);

			Timesheet ts = new Timesheet()
			{
				CarerCode = carer.CarerCode,
				WeekCommencing = weekCommencing,
				Carer = carer
			};

			// CarerContracts
			ts.Contracts = _context.Set<CarerContract>().FromSql("GetCarerContractInfo @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			bool isContracted = ts.Contracts.Any(c => c.ContractMins > 0);

			// ScheduledAvailability
			ts.ScheduledAvailability = _context.Set<Availability>().FromSql("GetCarerScheduledAvailability @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			// ActualAvailability
			ts.ActualAvailability = _context.Set<Availability>().FromSql("GetCarerActualAvailability @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			// TODO Remove Scheduled Availability on Actual Availability Days
			// DELETE FROM @Scheduled WHERE CONVERT(DATE, ThisStart) IN (SELECT CONVERT(DATE, ThisStart) FROM @ActAvail)
			ts.ActualAvailability.Select(aa => aa.ThisStart.Date).Distinct().ToList().ForEach(dt => {
				ts.ScheduledAvailability.Where(sa => sa.ThisStart.Date == dt).ToList().ForEach(sa => {
					ts.ScheduledAvailability.Remove(sa);
				});
			});

			// CarerBookings
			ts.Bookings = GetBookings(carerCode, weekCommencing, weekCommencing.AddDays(6));

			// Adjustments
			ts.Adjustments = _context.Set<Adjustment>().FromSql("GetTimesheetAdjustments @CarerCode, @PeriodStart, @PeriodFinish",
				parameters: new [] {
					new SqlParameter("@CarerCode", carerCode),
					new SqlParameter("@PeriodStart", weekCommencing),
					new SqlParameter("@PeriodFinish", weekCommencing.AddDays(6))
					})
				.ToList();

			// Transform Bookings -> Shifts
			ts.Shifts = BookingsToShifts(weekCommencing, weekCommencing.AddDays(6), ts.Bookings, ts.CarerCode);

			// TODO Overlay Annual Leave and Sickness Absence on Scheduled Availability for truer picture

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

        public IEnumerable<Summary> GetSummaries(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
			List<Summary> summaries = _context.Set<Summary>()
				.FromSql("GetTeamTimesheetSummary @teamCode, @periodStart, @periodEnd",
					parameters: new [] {
						new SqlParameter("@teamCode", teamCode),
						new SqlParameter("@periodStart", periodStart),
						new SqlParameter("@periodEnd", periodEnd)})
				.ToList();
			// TODO See if we can async this
			summaries.ForEach(sum => {
				var shifts = BookingsToShifts(periodStart, periodEnd,
					GetBookings(sum.CarerCode, periodStart, periodEnd), sum.CarerCode);
				sum.ActualMins = shifts.Sum(sh => sh.ShiftMins);
			});
			return summaries;
		}

		public IEnumerable<Adjustment> GetTimesheetAdjustments(int carerCode, DateTime weekCommencing)
		{
			return _context.Set<Adjustment>().FromSql("GetTimesheetAdjustments @CarerCode, @WeekCommencing",
				parameters: new [] {
					new SqlParameter("@CarerCode", carerCode),
					new SqlParameter("@WeekCommencing", weekCommencing)}).ToList();
		}


		// TODO Consider renaming this method since it's being used for upserts
		public Adjustment AddTimesheetAdjustment(Adjustment adj)
		{
			_context.Database.ExecuteSqlCommand("PutTimesheetAdjustment @Id, @Guid, @CarerCode, @WeekCommencing, @RequestedBy, @Requested, @AuthorisedBy, @Authorised, @RejectedBy, @Rejected, @ContractCode, @DayOffset, @Reason, @Hours, @Mins",
				new [] {
					// TODO Consider null coalescing date values also
					new SqlParameter { ParameterName = "@Id", Value = adj.Id },
					new SqlParameter { ParameterName = "@Guid", Value = adj.Guid },
					new SqlParameter { ParameterName = "@CarerCode", Value = adj.CarerCode },
					new SqlParameter { ParameterName = "@WeekCommencing", Value = adj.WeekCommencing },
					new SqlParameter { ParameterName = "@RequestedBy", Value = adj.RequestedBy ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@Requested", SqlDbType = SqlDbType.DateTime2, Value = adj.Requested ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@AuthorisedBy",  Value = adj.AuthorisedBy ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@Authorised", SqlDbType = SqlDbType.DateTime2, Value=adj.Authorised ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@RejectedBy", Value = adj.RejectedBy ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@Rejected", SqlDbType = SqlDbType.DateTime2, Value = adj.Rejected ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@ContractCode", Value = adj.ContractCode },
					new SqlParameter { ParameterName = "@DayOffset", Value = adj.DayOffset },
					new SqlParameter { ParameterName = "@Reason", Value = adj.Reason ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@Hours", Value = adj.Hours },
					new SqlParameter { ParameterName = "@Mins", Value = adj.Mins }
				});
			
			return _context.Adjustments.FirstOrDefault(a => a.Guid == adj.Guid);
		}

		public void RemoveTimesheetAdjustment(int id)
		{
			_context.Database.ExecuteSqlCommand("RemoveTimeSheetAdjustment @AdjustId", new [] {
				new SqlParameter("@AdjustId", id)
			});
		}

		private ICollection<CarerBooking> GetBookings(int carerCode, DateTime periodStart, DateTime periodFinish)
		{
			return _context.Set<CarerBooking>().FromSql("GetCarerBookings @CarerCode, @PeriodStart, @PeriodFinish",
				parameters: new [] {
					new SqlParameter("@CarerCode", carerCode),
					new SqlParameter("@PeriodStart", periodStart),
					new SqlParameter("@PeriodFinish", periodFinish)
					})
				.ToList();		}

        public IEnumerable<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd)
        {
            return _context.Set<Adjustment>().FromSql("GetTimesheetAdjustmentsByTeam @TeamCode, @PeriodStart, @PeriodEnd",
				parameters: new [] {
					new SqlParameter("@TeamCode", teamCode),
					new SqlParameter("@PeriodStart", periodStart),
					new SqlParameter("@PeriodEnd", periodEnd)
				})
				.ToList();
        }
    }
}