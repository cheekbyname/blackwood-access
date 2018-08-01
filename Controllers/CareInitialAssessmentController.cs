namespace Blackwood.Access.Controllers
{
    using Core.Care.Services;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System.Threading.Tasks;

    [Route("api/[Controller]")]
    public class CareInitialAssessmentController : ControllerBase
    {
        private readonly ICareInitialAssessmentService _service;
        private readonly ILogger<CareInitialAssessmentController> _logger;

        public CareInitialAssessmentController(ICareInitialAssessmentService service, ILogger<CareInitialAssessmentController> logger)
            => (_service, _logger) = (service, logger);

        [HttpGet("[action]")]
        public async Task<IActionResult> CareInitialAssessments() => Ok(await _service.GetAllAssessments());

        [HttpGet("[action]")]
        public async Task<IActionResult> CareInitialAssessment(int id) => Ok(await _service.GetAssessment(id));
    }
}
