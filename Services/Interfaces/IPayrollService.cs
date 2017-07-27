namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
    using Models;
    using System.Security.Claims;

    public interface IPayrollService
    {
        Timesheet GetTimesheet(int carerCode, DateTime weekCommencing);
        ICollection<Summary> GetAdjustedSummaries(int teamCode, DateTime periodStart, DateTime periodEnd);
        Adjustment PutTimesheetAdjustment(Adjustment adjust, ClaimsPrincipal user);
        ICollection<Payroll> GetPayrollData(int teamCode, DateTime periodStart, DateTime periodEnd);
  	}
}