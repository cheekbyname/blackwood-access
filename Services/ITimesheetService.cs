namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using Models;
    using System.Security.Claims;

    public interface ITimesheetService
    {
        IEnumerable<Team> GetTeams();
        IEnumerable<Carer> GetCarers();
        IEnumerable<Carer> GetCarersByTeam(int teamCode);
        Timesheet GetTimesheet(int carerCode, DateTime weekCommencing);
        IEnumerable<Summary> GetSummaries(int teamCode, DateTime periodStart, DateTime periodEnd);
        IEnumerable<Adjustment> GetTimesheetAdjustments(int carerCode, DateTime periodStart, DateTime periodFinish);
        Adjustment AddTimesheetAdjustment(Adjustment adjust, ClaimsPrincipal user);
        void RemoveTimesheetAdjustment(int id);
        IEnumerable<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd);
  	}
}