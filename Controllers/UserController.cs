namespace Blackwood.Access.Controllers
{
    using Core.Data.Models;
    using Core.Payroll.Service.Services;
    using Microsoft.AspNetCore.Mvc;
    using System;
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

        [HttpPut("[action]")]
        public void PutUser([FromBody] AccessUser user)
        {
            _service.PutUser(user);
        }
    }
}