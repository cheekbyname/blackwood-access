namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using System.Data.Common;
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

        public IEnumerable<Carer> GetCarers()
        {
			return _context.Carers.OrderBy(c=>c.Forename).ThenBy(c=>c.Surname).ToList();
        }

        public Timesheet GetTimesheet(int carerCode, DateTime weekCommencing)
        {
			Console.Write($"GetTimesheet for {carerCode} w/c {weekCommencing}\n");

			Carer carer = _context.Carers.FirstOrDefault(c => c.CarerCode == carerCode);

			Console.Write($"Retrieved entity for {carer.Forename} {carer.Surname}\n");

			Timesheet ts = new Timesheet()
			{
				CarerCode = carer.CarerCode,
				WeekCommencing = weekCommencing,
				Carer = carer
			};

			DbParameter pCarerCode = new SqlParameter("@CarerCode", carerCode);
			DbParameter pWeekCommencing = new SqlParameter("@WeekCommencing", weekCommencing);

			// CarerContracts
			ts.Contracts = _context.Set<CarerContract>().FromSql("GetCarerContractInfo @CarerCode, @WeekCommencing",
				parameters: new [] { pCarerCode, pWeekCommencing }).ToList();

			// ts.Contracts = _context.CarerContracts.FromSql("GetCarerContractInfo @CarerCode, @WeekCommencing",
			// 	parameters: new [] { pCarerCode, pWeekCommencing}).ToList();

			// ScheduledAvailability
			// ActualAvailability
			// CarerBookings

            return ts;
        }
    }
}