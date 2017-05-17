namespace Blackwood.Access.Controllers
{
    using Models;
    using Services;
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;

    [Route("api/[Controller]")]
    public class CareInitialAssessmentController : ControllerBase
    {
        private ICareInitialAssessmentService _service;

        public CareInitialAssessmentController(ICareInitialAssessmentService service)
        {
            _service = service;
        }

        [HttpGet("[action]")]
        public IEnumerable<CareInitialAssessment> CareInitialAssessments()
        {
            return _service.GetAllAssessments();
        }
    }
}
