namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using Models;

    public interface ITimesheetService
    {
      IEnumerable<Carer> GetCarers();
      Timesheet GetTimesheet(Carer carer, DateTime weekCommencing);
  	}
}