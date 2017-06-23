namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using Blackwood.Access.Models;
    using Microsoft.EntityFrameworkCore;

    public class TimesheetService : ITimesheetService
    {
		private static int[] _absenceCodes = { 108, 109 };	// TODO Consider unpaid leave situation
		private AccessContext _context;

		public TimesheetService(AccessContext context)
		{
			_context = context;
		}

		public IEnumerable<Team> GetTeams()
		{
			return _context.Teams.OrderBy(c => c.TeamDesc).ToList();
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
			ts.Bookings = _context.Set<CarerBooking>().FromSql("GetCarerBookings @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			// Adjustments
			ts.Adjustments = _context.Set<Adjustment>().FromSql("GetTimesheetAdjustments @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing)}).ToList();

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

			// Setup for Shift calculation
			ts.Shifts = new List<Shift>();
			Shift shift;
			DateTime[] dates = DatesCovered(weekCommencing, 7); 

			dates.ToList().ForEach(dt => {

				TimeSpan gap;
				int day = Array.FindIndex(dates, dx => dx == dt);

				// First Shift of this day
				shift = new Shift() { CarerCode = ts.CarerCode, Sequence = 1, Day = day };

				ts.Bookings.Where(bk => bk.ThisStart.Date == dt && !_absenceCodes.Any(ac => ac == bk.BookingType))
					.OrderBy(bk => bk.ThisStart).ToList().ForEach(bk => {

					// Calculate gap from last booking and adjust Shift Start/Finish times
					gap = (bk.ThisStart - shift.Finish) ?? TimeSpan.FromMinutes(0);
					shift.Start = shift.Start ?? bk.ThisStart;

					//  TODO Check for Unpaid Break Booking Type
					// Begin new Shift if valid shift break detected
					if (gap >= TimeSpan.FromHours(2) &&
						((bk.ThisStart.Hour >= 14 && bk.ThisStart.Hour <= 16) || (bk.ThisFinish.Hour >= 14 && bk.ThisFinish.Hour <= 16 )))
					{
						ts.Shifts.Add(shift);
						shift = new Shift() {
							CarerCode = ts.CarerCode,
							Sequence = ts.Shifts.Where(sh => sh.Day == day).Select(sh => sh.Sequence).Max() + 1,
							Day = day
						};
					}
					else
					{
						shift.Finish = bk.ThisFinish;
						shift.ShiftMins = (int)((shift.Finish - shift.Start).Value.TotalMinutes);		// TODO Factor in breaks
					}

					// Tag Booking with Shift Sequence
					bk.Shift = shift.Sequence;
				});
				ts.Shifts.Add(shift);
			});

			// Strip out blank Shifts
			ts.Shifts = ts.Shifts.Where(sh => sh.Start != null && sh.Finish != null).ToList();

			// TODO Overlay Annual Leave and Sickness Absence on Scheduled Availability for truer picture

            return ts;
        }

        private DateTime[] DatesCovered(DateTime dateCommencing, int periodLength)
        {
			DateTime[] dates = new DateTime[periodLength];
			for(int d = 0; d < periodLength; d++) {
				dates[d] = dateCommencing.AddDays(d);
			}
			return dates;
        }

        public IEnumerable<Summary> GetSummaries(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
			return _context.Set<Summary>().FromSql("GetTeamTimesheetSummary @teamCode, @periodStart, @periodEnd",
				parameters: new [] { new SqlParameter("@teamCode", teamCode), new SqlParameter("@periodStart", periodStart),
				new SqlParameter("@periodEnd", periodEnd)});
		}

		// Do we actually even need this?
		public IEnumerable<Adjustment> GetTimesheetAdjustments(int carerCode, DateTime weekCommencing)
		{
			return _context.Set<Adjustment>().FromSql("GetTimesheetAdjustments @CarerCode, @WeekCommencing",
				parameters: new [] {
					new SqlParameter("@CarerCode", carerCode),
					new SqlParameter("@WeekCommencing", weekCommencing)}).ToList();
		}

		public Adjustment AddTimesheetAdjustment(Adjustment adj)
		{
			_context.Database.ExecuteSqlCommand("PutTimesheetAdjustment @Id, @Guid, @CarerCode, @WeekCommencing, @RequestedBy, @Requested, @AuthorisedBy, @Authorised, @ContractCode, @DayOffset, @Reason, @Hours, @Mins",
				new [] {
					// TODO Consider null coalescing date values also
					new SqlParameter { ParameterName = "@Id", Value = adj.Id },
					new SqlParameter { ParameterName = "@Guid", Value = adj.Guid },
					new SqlParameter { ParameterName = "@CarerCode", Value = adj.CarerCode },
					new SqlParameter { ParameterName = "@WeekCommencing", Value = adj.WeekCommencing },
					new SqlParameter { ParameterName = "@RequestedBy", Value = adj.RequestedBy ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@Requested", SqlDbType = SqlDbType.DateTime2, Value=adj.Requested },
					new SqlParameter { ParameterName = "@AuthorisedBy",  Value = adj.AuthorisedBy ?? (object)DBNull.Value },
					new SqlParameter { ParameterName = "@Authorised", SqlDbType = SqlDbType.DateTime2, Value=adj.Authorised },
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
    }
}