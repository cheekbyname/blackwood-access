namespace Blackwood.Access.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Blackwood.Reporting.Reporting.Service;
    using System.Threading.Tasks;
    using System.Linq;
    using Blackwood.Core.Data.Models.Reporting;

    [Route("api/[Controller]")]
    public class ReportingController : ControllerBase
    {
        private readonly ILogger<ReportingController> _logger;
        private readonly IReportingDataService _dataService;
        private readonly IReportingService _reportService;

        public ReportingController(ILogger<ReportingController> logger, IReportingDataService dataService, IReportingService reportService)
            => (_logger, _dataService, _reportService) = (logger, dataService, reportService);

        [HttpGet("[action]")]
        public async Task<IActionResult> AllReports() => Ok(await _dataService.GetAllReports());

        [HttpGet("[action]")]
        public async Task<IActionResult> AllSchedules() => Ok(await _dataService.GetAllSchedules());

        [HttpGet("[action]")]
        public async Task<IActionResult> SchedulesForUser() => Ok(await _dataService.GetSchedulesForUser(HttpContext.User));

        [HttpGet("[action]")]
        public IActionResult Frequencies() => Ok(_dataService.GetFrequencyNames().Select(fq => new Lookup((int)fq.Key, fq.Value)));

        [HttpGet("[action]")]
        public IActionResult Directions() => Ok(_dataService.GetDirectionNames().Select(dr => new Lookup((int)dr.Key, dr.Value)));

        [HttpGet("[action]")]
        public IActionResult Scopes() => Ok(_dataService.GetScopeNames().Select(so => new Lookup((int)so.Key, so.Value)));

        [HttpGet("[action]")]
        public async Task<IActionResult> Teams() => Ok(await _dataService.GetTeams());

        [HttpGet("[action]")]
        public async Task<IActionResult> LocalAuthorities() => Ok(await _dataService.GetLocalAuthorities());

        [HttpGet("[action]")]
        public async Task<IActionResult> Services() => Ok(await _dataService.GetServices());

        [HttpGet("[action]")]
        public async Task<IActionResult> Regions() => Ok(await _dataService.GetRegions());

        [HttpPut("[action]")]
        public async Task<IActionResult> Schedule([FromBody] Schedule sched) => Ok(await _dataService.PutSchedule(sched, HttpContext.User));

        [HttpGet("[action]/{scheduleId}")]
        public async Task<IActionResult> Schedule(int scheduleId) => Ok(await _dataService.GetSchedule(scheduleId));

        // Private stubby for transposing dictionaries to Enumerables with named properties
        private class Lookup
        {
            public Lookup(int id, string desc)
            {
                Id = id;
                Description = desc;
            }

            public int Id { get; set; }
            public string Description { get; set; }
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> Subscribe(int scheduleId)
            => Ok(await _dataService.Subscribe(scheduleId, HttpContext.User));

        [HttpPut("[action]")]
        public async Task<IActionResult> Unsubscribe(int scheduleId)
            => Ok(await _dataService.Unsubscribe(scheduleId, HttpContext.User));

        [HttpPut("[action]")]
        public async Task<IActionResult> SubscribeUser(int scheduleId, int userId)
            => Ok(await _dataService.Subscribe(scheduleId, userId));
    }
}