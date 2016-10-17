namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using Models;

    public interface ITimesheetService
    {
        IEnumerable<Team> GetTeams();
        IEnumerable<Carer> GetCarers();
        IEnumerable<Carer> GetCarersByTeam(int TeamCode);
        Timesheet GetTimesheet(int carerCode, DateTime weekCommencing);
  	}
}