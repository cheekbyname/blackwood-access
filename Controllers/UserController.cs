namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.User.Service;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Threading.Tasks;

    [Route("api/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService service, ILogger<UserController> logger)
        {
            _service = service;
            _logger = logger;
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> GetUserInfo()
        {
            try
            {
                return Ok(await _service.GetUserInfo(HttpContext.User));
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return Ok(await _service.GetInvalidUser());
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _service.GetAllUsers());
        }

        [HttpPut("[action]")]
        public void PutUser([FromBody] AccessUser user)
        {
            _service.PutUser(user);
        }
    }
}