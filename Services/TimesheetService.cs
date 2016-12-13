namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using Blackwood.Access.Models;
    using Microsoft.EntityFrameworkCore;

    public class TimesheetService : ITimesheetService
    {
		private AccessContext _context;

		public TimesheetService(AccessContext context)
		{
			_context = context;
		}

		public IEnumerable<Team> GetTeams()
		{
			return _context.Teams.OrderBy(c=>c.TeamDesc).ToList();
		}
        public IEnumerable<Carer> GetCarers()
        {
			return _context.Carers.OrderBy(c=>c.Forename).ThenBy(c=>c.Surname).ToList();
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

			// Days covered
			DateTime[] dates = DatesCovered(weekCommencing, 7); 

			dates.ToList().ForEach(dt => {
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

				DateTime? shiftStart = null;
				DateTime? lastEnd = null;
				TimeSpan? thisGap = null;
				int shiftCount = 1;
				ts.Bookings.Where(bk => bk.ThisStart.Date == dt).OrderBy(bk => bk.ThisStart).ToList().ForEach(bk => {
					thisGap = bk.ThisStart - lastEnd ?? TimeSpan.FromMinutes(0);
					shiftStart = shiftStart ?? bk.ThisStart;
					if (thisGap >= TimeSpan.FromHours(2)) {
						shiftCount++;
						shiftStart = null;
					}
					bk.Shift = shiftCount;
					lastEnd = bk.ThisFinish;
				});
			});

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
    }
}