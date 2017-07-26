namespace Blackwood.Access.Services
{
    using Blackwood.Access.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class PayrollValidationService : IPayrollValidationService
    {
        IPayrollService _service;

        public PayrollValidationService(IPayrollService service)
        {
            _service = service;
        }

        public ValidationResult Validate(int teamCode, DateTime periodStart, DateTime periodFinish)
        {
            ValidationResult valid = new ValidationResult();
            List<Carer> carers = _service.GetCarersByTeam(teamCode, periodStart).ToList();

            valid.PendingAdjustments = _service.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodFinish);
            
            return valid;
        }
    }
}