namespace Blackwood.Access.Services
{
    using Blackwood.Access.Models;
    using System;

    public interface IPayrollValidationService
    {
        ValidationResult Validate(int teamCode, DateTime periodStart, DateTime periodFinish);
    }
}