namespace Blackwood.Access.Controllers
{
    using System.Collections.Generic;
    using Core.Accident.Service;
    using Core.Data.Models;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[Controller]")]
    public class AccidentController : ControllerBase
    {
        private IAccidentService _service;

        public AccidentController(IAccidentService service)
        {
            _service = service;
        }

        [HttpGet("[action]")]
        public IEnumerable<IncidentSummary> Summaries()
        {
            return _service.GetAllIncidentSummaries();
        }

        [HttpGet("[action]")]
        public Incident Incident(int incidentId)
        {
            return _service.GetIncidentById(incidentId);
        }
    }
}