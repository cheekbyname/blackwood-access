namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public interface IPayrollDataService
    {
        ICollection<Carer> GetCarersByTeam(int teamCode, DateTime? periodStart);
        ICollection<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd);
        IQueryable<PayrollCodeMap> GetPayrollCodeMap();
        ICollection<Team> GetTeams();
        ICollection<Carer> GetCarers();
        Carer GetCarerByCode(int carerCode);
        ICollection<Availability> GetScheduledAvailability(int carerCode, DateTime weekCommencing);
        ICollection<Availability> GetActualAvailability(int carerCode, DateTime weekCommencing);
        ICollection<Summary> GetSummaries(int teamCode, DateTime periodStart, DateTime periodEnd);
        ICollection<Adjustment> GetTimesheetAdjustments(int carerCode, DateTime periodStart, DateTime periodFinish);
        void PutTimesheetAdjustment(Adjustment adj);
        IQueryable<Adjustment> GetAllAdjustments();
        void RemoveTimesheetAdjustment(int id);
        ICollection<CarerBooking> GetBookings(int carerCode, DateTime periodStart, DateTime periodFinish);
        ICollection<CarerContract> GetContracts(int carerCode, DateTime periodStart);
        WorkPattern WorkPattern(int carer);
    }
}
