namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using Models;
    using System.Security.Claims;

    public interface IPayrollService
    {
        ICollection<Team> GetTeams();
        ICollection<Carer> GetCarers();
        ICollection<Carer> GetCarersByTeam(int teamCode, DateTime? periodStart);
        Timesheet GetTimesheet(int carerCode, DateTime weekCommencing);
        ICollection<Summary> GetSummaries(int teamCode, DateTime periodStart, DateTime periodEnd);
        ICollection<Adjustment> GetTimesheetAdjustments(int carerCode, DateTime periodStart, DateTime periodFinish);
        Adjustment AddTimesheetAdjustment(Adjustment adjust, ClaimsPrincipal user);
        void RemoveTimesheetAdjustment(int id);
        ICollection<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd);
        ICollection<Payroll> GetPayrollData(int teamCode, DateTime periodStart, DateTime periodEnd);
  	}
}