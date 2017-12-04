namespace Blackwood.Access.Controllers
{
    using Core.Accident.Service;
    using Core.Data.Models;
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;

    [Route("api/[controller]")]
    public class AccidentController : ControllerBase
    {
        private IAccidentService _service;

        public AccidentController(IAccidentService service)
        {
            _service = service;
        }

        [HttpGet("[action]")]
        public IEnumerable<IncidentSummary> Summaries() { return _service.GetIncidentSummaries(); }

        [HttpGet("[action]/{id}")]
        public Incident Incident(int id) { return _service.GetIncident(id); }

        [HttpGet("[action]")]
        public IEnumerable<Person> People() { return _service.GetPeople(); }

        [HttpGet("[action]/{id}")]
        public Person People(int id) { return _service.GetPerson(id); }

        [HttpGet("[action]")]
        public IEnumerable<AccidentUser> AirUsers() { return _service.GetUsers(); }

        [HttpGet("[action]/{id}")]
        public AccidentUser AirUser(int id) { return _service.GetUser(id); }

        [HttpGet("[action]")]
        public IEnumerable<Category> Categories() { return _service.GetCategories(); }

        [HttpGet("[action]/{id}")]
        public Category Category(int id) { return _service.GetCategory(id); }

        [HttpGet("[action]")]
        public IEnumerable<Cause> Causes() { return _service.GetCauses(); }

        [HttpGet("[action]")]
        public IEnumerable<Gender> Genders() { return _service.GetGenders(); }

        [HttpGet("[action]")]
        public IEnumerable<InjuryLocation> Injuries() { return _service.GetInjuryLocations(); }

        [HttpGet("[action]")]
        public IEnumerable<Involvement> Involvements() { return _service.GetInvolvements(); }

        [HttpGet("[action]")]
        public IEnumerable<Location> Locations() { return _service.GetLocations(); }

        [HttpGet("[action]")]
        public IEnumerable<Region> Regions() { return _service.GetRegions(); }

        [HttpGet("[action]")]
        public IEnumerable<Role> Roles() { return _service.GetRoles(); }

        [HttpGet("[action]")]
        public IEnumerable<Type> Types() { return _service.GetTypes(); }

        [HttpGet("[action]")]
        public IEnumerable<YesNoMaybe> Options() { return _service.GetOptions(); }
    }
}