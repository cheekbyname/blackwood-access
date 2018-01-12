namespace Blackwood.Access.Controllers
{
    using Core.Accident.Service;
    using Core.User.Service;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System.Threading.Tasks;

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
        public async Task<IActionResult> Summaries(string term)
            => Ok(await _accidentService.GetIncidentSummaries(await _userService.GetUserInfo(HttpContext.User), term));

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> Incident(int id) => Ok(await _accidentService.GetIncident(id));

        [HttpGet("[action]")]
        public async Task<IActionResult> People() => Ok(await _accidentService.GetPeople());

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> People(int id) => Ok(await _accidentService.GetPerson(id));

        [HttpGet("[action]")]
        public async Task<IActionResult> AirUsers() => Ok(await _accidentService.GetUsers());

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> AirUser(int id) => Ok(await _accidentService.GetUser(id));

        [HttpGet("[action]")]
        public async Task<IActionResult> Categories() => Ok(await _accidentService.GetCategories());

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> Category(int id) => Ok(await _accidentService.GetCategory(id));

        [HttpGet("[action]")]
        public async Task<IActionResult> Causes() => Ok(await _accidentService.GetCauses());

        [HttpGet("[action]")]
        public async Task<IActionResult> Genders() => Ok(await _accidentService.GetGenders());

        [HttpGet("[action]")]
        public async Task<IActionResult> Injuries() => Ok(await _accidentService.GetInjuryLocations());

        [HttpGet("[action]")]
        public async Task<IActionResult> Involvements() => Ok(await _accidentService.GetInvolvements());

        [HttpGet("[action]")]
        public async Task<IActionResult> Locations() => Ok(await _accidentService.GetLocations());

        [HttpGet("[action]")]
        public async Task<IActionResult> Regions() => Ok(await _accidentService.GetRegions());

        [HttpGet("[action]")]
        public async Task<IActionResult> Roles() => Ok(await _accidentService.GetRoles());

        [HttpGet("[action]")]
        public async Task<IActionResult> Types() => Ok(await _accidentService.GetTypes());

        [HttpGet("[action]")]
        public async Task<IActionResult> Options() => Ok(await _accidentService.GetOptions());
    }
}