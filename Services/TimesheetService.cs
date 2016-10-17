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

			// ScheduledAvailability
			ts.ScheduledAvailability = _context.Set<Availability>().FromSql("GetCarerScheduledAvailability @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			// ActualAvailability
			ts.ActualAvailability = _context.Set<Availability>().FromSql("GetCarerActualAvailability @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			// TODO Remove Scheduled Availability on Actual Availability Days
			// DELETE FROM @Scheduled WHERE CONVERT(DATE, ThisStart) IN (SELECT CONVERT(DATE, ThisStart) FROM @ActAvail)

			// CarerBookings
			ts.Bookings = _context.Set<CarerBooking>().FromSql("GetCarerBookings @CarerCode, @WeekCommencing",
				parameters: new [] { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }).ToList();

			// TODO Overlay Annual Leave and Sickness Absence on Scheduled Availability for truer picture

            return ts;
        }
    }
}