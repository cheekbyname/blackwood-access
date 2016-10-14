namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Blackwood.Access.Models;

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

        public Timesheet GetTimesheet(Carer carer, DateTime weekCommencing)
        {
			Timesheet ts = new Timesheet()
			{
				CarerCode = carer.CarerCode,
				WeekCommencing = weekCommencing,
				Carer = carer
			};

			// CarerContracts
			// ScheduledAvailability
			// ActualAvailability
			// CarerBookings

            return ts;
        }
    }
}