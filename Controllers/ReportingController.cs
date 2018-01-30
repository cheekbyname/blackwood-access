namespace Blackwood.Access.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Blackwood.Reporting.Reporting.Service;
    using System.Threading.Tasks;
    using System.Linq;

    [Route("api/[Controller]")]
    public class ReportingController : ControllerBase
    {
        private readonly ILogger<ReportingController> _logger;
        private readonly IReportingDataService _service;

        public ReportingController(ILogger<ReportingController> logger, IReportingDataService service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> AllReports() => Ok(await _service.GetAllReports());

        [HttpGet("[action]")]
        public async Task<IActionResult> AllSchedules() => Ok(await _service.GetAllSchedules());

        [HttpGet("[action]")]
        public async Task<IActionResult> SchedulesForUser() => Ok(await _service.GetSchedulesForUser(HttpContext.User));

        [HttpGet("[action]")]
        public IActionResult Frequencies() => Ok(_service.GetFrequencyNames().Select(fq => new Lookup((int)fq.Key, fq.Value)));

        [HttpGet("[action]")]
        public IActionResult Directions() => Ok(_service.GetDirectionNames().Select(dr => new Lookup((int)dr.Key, dr.Value)));

        [HttpGet("[action]")]
        public IActionResult Scopes() => Ok(_service.GetScopeNames().Select(so => new Lookup((int)so.Key, so.Value)));

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
    }
}