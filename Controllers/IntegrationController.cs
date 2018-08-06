namespace Blackwood.Access.Controllers
{
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

        [Route("[action]")]
        public async Task<IActionResult> AllUsers() => Ok(await _integrationData.GetAllUsers());
    }
}