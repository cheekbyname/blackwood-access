namespace Blackwood.Access.Controllers
{
	using System;
	using System.Collections.Generic;
	using Models;
	using Services;
	using Microsoft.AspNetCore.Mvc;

	[Route("api/[Controller]")]
	public class PayrollController : ControllerBase
	{
		private IPayrollService _service;
        private IPayrollDataService _dataService;
		private IPayrollValidationService _validation;

		public PayrollController(IPayrollService service, IPayrollValidationService validation, IPayrollDataService dataService)
		{
			_service = service;
            _dataService = dataService;
			_validation = validation;
		}

		[HttpGet("[action]")]
		public IEnumerable<Team> Teams()
		{
            return _dataService.GetTeams();
		}

		[HttpGet("[action]")]
		public IEnumerable<Carer> CarersByTeam(int TeamCode, DateTime periodStart)
		{
            return _dataService.GetCarersByTeam(TeamCode, periodStart);
		}

		[HttpGet("[action]")]
		public Timesheet Timesheet(int carerCode, DateTime weekCommencing)
		{
			return _service.GetTimesheet(carerCode, weekCommencing);
		}

		[HttpGet("[action]")]
		public IEnumerable<Summary> Summaries(int teamCode, DateTime periodStart, DateTime periodEnd){
			return _service.GetAdjustedSummaries(teamCode, periodStart, periodEnd);
		}

		[HttpPut("[action]")]
		public Adjustment AddTimesheetAdjustment([FromBody] Adjustment adj)
		{
			return _service.PutTimesheetAdjustment(adj, HttpContext.User);
		}

		[HttpDelete("[action]")]
		public void RemoveTimesheetAdjustment(int id)
		{
			_dataService.RemoveTimesheetAdjustment(id);
		}

		[HttpPut("[action]")]
		public void UpdateTimesheetAdjustment([FromBody] Adjustment adj)
		{
			_service.PutTimesheetAdjustment(adj, HttpContext.User);	// Don't need to return the ID for updates
		}

		[HttpGet("[action]")]
		public IEnumerable<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
			return _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodEnd);
		}

        [HttpGet("[action]")]
        public IEnumerable<Payroll> GetPayrollData(int teamCode, DateTime periodStart, DateTime periodFinish)
        {
            return _service.GetPayrollData(teamCode, periodStart, periodFinish);
        }

        [HttpGet("[action]")]
		public ValidationResult Validate(int teamCode, DateTime periodStart, DateTime periodFinish)
		{
			return _validation.Validate(teamCode, periodStart, periodFinish);
		}

        [HttpGet("[action]")]
        public Carer GetCarerByCode(int carerCode)
        {
            return _dataService.GetCarerByCode(carerCode);
        }

        // This method for debug purposes only
        [HttpGet("[action]")]
        public IEnumerable<CarerBooking> GetBookings(int carerCode, DateTime periodStart, DateTime periodFinish)
        {
            return _dataService.GetBookings(carerCode, periodStart, periodFinish);
        }
	}
}