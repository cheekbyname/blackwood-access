namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.Payroll.Service.Services;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    [Route("api/[Controller]")]
	public class PayrollController : ControllerBase
	{
		private readonly IPayrollService _service;
        private readonly IPayrollDataService _dataService;
		private readonly IPayrollValidationService _validation;
        private readonly ILogger<PayrollController> _logger;

		public PayrollController(IPayrollService service, IPayrollValidationService validation, IPayrollDataService dataService,
            ILogger<PayrollController> logger)
		{
			_service = service;
            _dataService = dataService;
			_validation = validation;
            _logger = logger;
		}

		[HttpGet("[action]")]
		public IEnumerable<Team> Teams() => _dataService.GetTeams();

		[HttpGet("[action]")]
		public IEnumerable<Carer> CarersByTeam(int TeamCode, DateTime periodStart) => _dataService.GetCarersByTeam(TeamCode, periodStart);

		[HttpGet("[action]")]
		public Timesheet Timesheet(int carerCode, DateTime weekCommencing) => _service.GetTimesheet(carerCode, weekCommencing);

		[HttpGet("[action]")]
		public IEnumerable<Summary> Summaries(int teamCode, DateTime periodStart, DateTime periodEnd)
            => _service.GetAdjustedSummaries(teamCode, periodStart, periodEnd);

		[HttpPut("[action]")]
		public Adjustment AddTimesheetAdjustment([FromBody] Adjustment adj)
		    => _service.PutTimesheetAdjustment(adj, HttpContext.User);

		[HttpDelete("[action]")]
		public void RemoveTimesheetAdjustment(int id)
		    => _dataService.RemoveTimesheetAdjustment(id);

		[HttpPut("[action]")]
		public void UpdateTimesheetAdjustment([FromBody] Adjustment adj)
		    => _service.PutTimesheetAdjustment(adj, HttpContext.User);	// Don't need to return the ID for updates

		[HttpGet("[action]")]
		public IEnumerable<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd)
		    => _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodEnd);

        [HttpGet("[action]")]
        public IEnumerable<Payroll> GetPayrollData(int teamCode, DateTime periodStart, DateTime periodFinish)
            =>_service.GetPayrollData(teamCode, periodStart, periodFinish);

        [HttpGet("[action]")]
		public ValidationResult Validate(int teamCode, DateTime periodStart, DateTime periodFinish)
		    => _validation.Validate(teamCode, periodStart, periodFinish);

        [HttpGet("[action]")]
        public Carer GetCarerByCode(int carerCode) => _dataService.GetCarerByCode(carerCode);

        [HttpGet("[action]")]
        public WorkPattern WorkPatterns(int carer) => _dataService.WorkPattern(carer);

		[HttpGet("[action]")]
		public IEnumerable<PayrollCodeMap> CodeMap() => _dataService.GetPayrollCodeMap().ToList();

		[HttpGet("[action]")]
		public IEnumerable<PayrollCodeType> CodeTypes() => _dataService.GetPayrollCodeTypes().ToList();
	}
}