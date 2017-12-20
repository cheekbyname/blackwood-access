namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.Payroll.Service.Services;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System.Collections.Generic;

    [Route("api/[Controller]")]
    public class CareInitialAssessmentController : ControllerBase
    {
        private readonly ICareInitialAssessmentService _service;
        private readonly ILogger<CareInitialAssessmentController> _logger;

        public CareInitialAssessmentController(ICareInitialAssessmentService service, ILogger<CareInitialAssessmentController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("[action]")]
        public IEnumerable<CareInitialAssessment> CareInitialAssessments()
        {
            return _service.GetAllAssessments();
        }

        [HttpGet("[action]")]
        public CareInitialAssessment CareInitialAssessment(int id) {
            return _service.GetAssessment(id);
        }
    }
}
