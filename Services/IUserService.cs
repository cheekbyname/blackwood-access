namespace Blackwood.Access.Services
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using Blackwood.Access.Models;

    public interface IUserService
    {
        AccessUser GetUserInfo(ClaimsPrincipal user);
        AccessUser GetInvalidUser();
        IEnumerable<AccessUser> GetAllUsers();
    }
}