namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.Operations.Integration;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class IntegrationController : ControllerBase
    {
        private readonly ILogger<IntegrationController> _logger;
        private readonly IIntegrationData _integrationData;

        public IntegrationController(ILogger<IntegrationController> logger, IIntegrationData integrationData)
            => (_logger, _integrationData) = (logger, integrationData);

        [HttpGet("[action]")]
        public async Task<IActionResult> AllUsers() => Ok(await _integrationData.GetAllUsers());

        [HttpGet("[action]")]
        public async Task<IActionResult> AUser(int personCode) => Ok(await _integrationData.GetUser(personCode));

        [HttpPut("[action]")]
        public async Task<IActionResult> MapUser(User user) => Ok(await _integrationData.MapUser(user));

        [HttpPut("[action]")]
        public async Task<IActionResult> ToggleEnable(User user) => Ok(await _integrationData.ToggleEnableSync(user));
    }
}