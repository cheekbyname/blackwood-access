namespace Blackwood.Access.Controllers
{
    using Core.Accident.Service;
    using Core.Data.Models;
    using Core.User.Service;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System.Collections.Generic;

    [Route("api/[controller]")]
    public class AccidentController : ControllerBase
    {
        private readonly IAccidentService _accidentService;
        private readonly IUserService _userService;
        private readonly ILogger<AccidentController> _logger;

        public AccidentController(IAccidentService accidentService, IUserService userService, ILogger<AccidentController> logger)
        {
            _accidentService = accidentService;
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("[action]/{term?}")]
        public IEnumerable<IncidentSummary> Summaries(string term)
        {
            return _accidentService.GetIncidentSummaries(_userService.GetUserInfo(HttpContext.User).Result, term);
        }

        [HttpGet("[action]/{id}")]
        public Incident Incident(int id) { return _accidentService.GetIncident(id); }

        [HttpGet("[action]")]
        public IEnumerable<Person> People() { return _accidentService.GetPeople(); }

        [HttpGet("[action]/{id}")]
        public Person People(int id) { return _accidentService.GetPerson(id); }

        [HttpGet("[action]")]
        public IEnumerable<AccidentUser> AirUsers() { return _accidentService.GetUsers(); }

        [HttpGet("[action]/{id}")]
        public AccidentUser AirUser(int id) { return _accidentService.GetUser(id); }

        [HttpGet("[action]")]
        public IEnumerable<Category> Categories() { return _accidentService.GetCategories(); }

        [HttpGet("[action]/{id}")]
        public Category Category(int id) { return _accidentService.GetCategory(id); }

        [HttpGet("[action]")]
        public IEnumerable<Cause> Causes() { return _accidentService.GetCauses(); }

        [HttpGet("[action]")]
        public IEnumerable<Gender> Genders() { return _accidentService.GetGenders(); }

        [HttpGet("[action]")]
        public IEnumerable<InjuryLocation> Injuries() { return _accidentService.GetInjuryLocations(); }

        [HttpGet("[action]")]
        public IEnumerable<Involvement> Involvements() { return _accidentService.GetInvolvements(); }

        [HttpGet("[action]")]
        public IEnumerable<Location> Locations() { return _accidentService.GetLocations(); }

        [HttpGet("[action]")]
        public IEnumerable<Region> Regions() { return _accidentService.GetRegions(); }

        [HttpGet("[action]")]
        public IEnumerable<Role> Roles() { return _accidentService.GetRoles(); }

        [HttpGet("[action]")]
        public IEnumerable<Type> Types() { return _accidentService.GetTypes(); }

        [HttpGet("[action]")]
        public IEnumerable<YesNoMaybe> Options() { return _accidentService.GetOptions(); }
    }
}