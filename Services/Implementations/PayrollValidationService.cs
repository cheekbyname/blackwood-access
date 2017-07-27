namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Linq;

    public class PayrollValidationService : IPayrollValidationService
    {
        IPayrollDataService _dataService;

        public PayrollValidationService(IPayrollDataService dataService)
        {
            _dataService = dataService;
        }

        public ValidationResult Validate(int teamCode, DateTime periodStart, DateTime periodFinish)
        {
            ValidationResult valid = new ValidationResult(teamCode, periodStart, periodFinish);

            valid.Carers = _dataService.GetCarersByTeam(teamCode, periodStart);
            valid.PendingAdjustments = _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodFinish);

            // Check Payroll Numbers
            valid.Carers.Where(ca => ca.PersonnelNumber == "" || ca.PersonnelNumber == null).ToList().ForEach(ca =>
            {
                valid.CarerDataValidationItems.Add(new CarerDataValidationItem() { Carer = ca, Revision = "Missing Payroll Number" });
            });

            // Check Caresys Mapping
            valid.Carers.Where(ca => ca.CareSysGuid == null).ToList().ForEach(ca =>
            {
                valid.CarerDataValidationItems.Add(new CarerDataValidationItem() { Carer = ca, Revision = "No Caresys Mapping for Default Team" });
            });

            // TODO Check CarerContract for Default Location

            return valid;
        }
    }
}