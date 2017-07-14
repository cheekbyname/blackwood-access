namespace Blackwood.Access.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using System;
    using Blackwood.Access.Models;
    using Blackwood.Access.Services;
    using System.Security.Claims;
    using System.Collections.Generic;

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
            try
            {
                return _service.GetUserInfo(HttpContext.User);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return _service.GetInvalidUser();
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<AccessUser> GetAllUsers()
        {
            return _service.GetAllUsers();
        }
    }
}