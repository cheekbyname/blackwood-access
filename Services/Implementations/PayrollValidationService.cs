namespace Blackwood.Access.Services
{
    using Blackwood.Access.Models;
    using System;
    using System.Collections.Generic;
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
            ValidationResult valid = new ValidationResult();
            List<Carer> carers = _dataService.GetCarersByTeam(teamCode, periodStart).ToList();

            valid.PendingAdjustments = _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodFinish);
            
            return valid;
        }
    }
}