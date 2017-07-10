namespace Blackwood.Access.Services
{
    using System;
    using System.Linq;
    using System.Security.Claims;
    using Blackwood.Access.Models;

    public class UserService : IUserService
    {
        private AccessContext _context;

        public UserService(AccessContext context)
        {
            _context = context;
        }

        public AccessUser GetUserInfo(ClaimsPrincipal user)
        {
            AccessUser accessUser = _context.AccessUsers.FirstOrDefault(u => u.DomainUsername == user.Identity.Name);
            if (accessUser == null)
            {
                accessUser = new AccessUser()
                {
                    DomainUsername = user.Identity.Name,
                    AccountName = user.Identity.Name.Replace("M_BLACKWOOD\\", "")
                };
                _context.AccessUsers.Add(accessUser);
                _context.SaveChanges();
            }
            return accessUser;
        }
    }
}