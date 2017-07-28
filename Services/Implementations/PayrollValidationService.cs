namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class PayrollValidationService : IPayrollValidationService
    {
        IPayrollDataService _dataService;
        IPayrollShiftService _shiftService;

        public PayrollValidationService(IPayrollDataService dataService, IPayrollShiftService shiftService)
        {
            _dataService = dataService;
            _shiftService = shiftService;
        }

        public ValidationResult Validate(int teamCode, DateTime periodStart, DateTime periodFinish)
        {
            ValidationResult valid = new ValidationResult(teamCode, periodStart, periodFinish);

            valid.Carers = _dataService.GetCarersByTeam(teamCode, periodStart);
            List<Adjustment> adjusts = _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodFinish).ToList();

            valid.PendingAdjustments = adjusts.Where(adj => adj.Authorised == null && adj.Rejected == null).ToList();
            valid.OtherAdjustments = adjusts.Except(valid.PendingAdjustments).ToList();

            // Check Payroll Numbers
            valid.Carers.Where(ca => ca.PersonnelNumber == "" || ca.PersonnelNumber == null).ToList().ForEach(ca =>
            {
                valid.CarerDataValidationItems.Add(new CarerDataValidationItem() { Carer = ca, Revision = "Missing Payroll Number" });
            });

            // TODO Check Annual Leave and/or Sickness Absence for blocked-out days

            // Invalid shifts
            valid.Carers.ToList().ForEach(carer =>
            {
                valid.InvalidShifts = valid.InvalidShifts.Concat(_shiftService.BookingsToShifts(periodStart, periodFinish,
                    _dataService.GetBookings(carer.CarerCode, periodStart, periodFinish), carer.CarerCode)
                    .Where(shift => shift.ValidBreak == false)).ToList();
            });

            // Check Caresys Mapping
            //valid.Carers.Where(ca => ca.CareSysGuid == null).ToList().ForEach(ca =>
            //{
            //    valid.CarerDataValidationItems.Add(new CarerDataValidationItem() { Carer = ca, Revision = "No Caresys Mapping for Default Team" });
            //});

            return valid;
        }
    }
}