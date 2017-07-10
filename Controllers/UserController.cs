namespace Blackwood.Access.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using System;
    using Blackwood.Access.Models;
    using Blackwood.Access.Services;
    using System.Security.Claims;

	[Route("api/[Controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }
        
        [HttpGet("[action]")]
        public AccessUser GetUserInfo()
        {
            return _service.GetUserInfo(this.HttpContext.User);
        }
    }
}