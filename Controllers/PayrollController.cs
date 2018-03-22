namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.Payroll.Service.Services;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

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
        public async Task<IActionResult> Teams() => Ok(await _dataService.GetTeams());

        [HttpGet("[action]")]
        public async Task<IActionResult> TeamsForUser() => Ok(await _dataService.GetTeamsForUser(HttpContext.User));

        [HttpGet("[action]")]
        public async Task<IActionResult> CarersByTeam(int TeamCode, DateTime periodStart)
            => Ok(await _dataService.GetCarersByTeam(TeamCode, periodStart));

        [HttpGet("[action]")]
        public async Task<IActionResult> Timesheet(int carerCode, DateTime weekCommencing)
            => Ok(await _service.GetTimesheet(carerCode, weekCommencing));

        [HttpGet("[action]")]
        public async Task<IActionResult> Summaries(int teamCode, DateTime periodStart, DateTime periodEnd, CancellationToken token)
        {
            // Cancellation actually not working, as per https://github.com/aspnet/AspNetCoreModule/issues/38
            token.ThrowIfCancellationRequested();
            return Ok(await _service.GetAdjustedSummaries(teamCode, periodStart, periodEnd));
        }

        [HttpPut("[action]")]
        public IActionResult AddTimesheetAdjustment([FromBody] Adjustment adj)
            => Ok(_service.PutTimesheetAdjustment(adj, HttpContext.User));

        [HttpDelete("[action]")]
        public void RemoveTimesheetAdjustment(int id)
            => _dataService.RemoveTimesheetAdjustment(id);

        [HttpPut("[action]")]
        public void UpdateTimesheetAdjustment([FromBody] Adjustment adj)
            => _service.PutTimesheetAdjustment(adj, HttpContext.User);  // Don't need to return the ID for updates

        [HttpGet("[action]")]
        public async Task<IActionResult> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd)
            => Ok(await _dataService.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodEnd));

        [HttpGet("[action]")]
        public async Task<IActionResult> GetPayrollData(int teamCode, DateTime periodStart, DateTime periodFinish)
            => Ok(await _service.GetPayrollExport(teamCode, periodStart, periodFinish));

        [HttpGet("[action]")]
        public async Task<IActionResult> Validate(int teamCode, DateTime periodStart, DateTime periodFinish)
            => Ok(await _validation.Validate(teamCode, periodStart, periodFinish));

        [HttpGet("[action]")]
        public async Task<IActionResult> GetCarerByCode(int carerCode) => Ok(await _dataService.GetCarerByCode(carerCode));

        [HttpGet("[action]")]
        public async Task<IActionResult> WorkPatterns(int carer) => Ok(await _dataService.WorkPattern(carer));

        [HttpGet("[action]")]
        public async Task<IActionResult> CodeMap()
            => Ok((await _dataService.GetPayrollCodeMap()).Where(t => t.Active).OrderByDescending(t => t.Type).ThenBy(t => t.TypeCode).ToList());

        [HttpPut("[action]")]
        public void CodeMap([FromBody] PayrollCodeMap map)
            => _dataService.PutPayrollCodeMap(map);


        [HttpGet("[action]")]
        public async Task<IActionResult> CodeTypes() => Ok(await _dataService.GetPayrollCodeTypes());

        [HttpPut("[action]")]
        public async Task<IActionResult> ApproveSummary([FromBody] TeamPeriod period)
        {
            var result = await _service.ApproveTeamPeriod(period, HttpContext.User);

            if (result.ValidationMessages[401] != null) return Unauthorized();
            if (result.ValidationMessages[400] != null) return BadRequest(result);

            return Ok(result);
        }
    }
}