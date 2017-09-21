namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.Payroll.Service.Services;
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

        [HttpGet("[action]")]
        public CareInitialAssessment CareInitialAssessment(int id) {
            return _service.GetAssessment(id);
        }
    }
}
