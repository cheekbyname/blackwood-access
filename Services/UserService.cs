namespace Blackwood.Access.Services
{
    using System;
    using System.Collections.Generic;
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

        public IEnumerable<AccessUser> GetAllUsers()
        {
            return _context.AccessUsers.OrderBy(ac => ac.AccountName);
        }

        public AccessUser GetInvalidUser()
        {
             return new AccessUser()
                {
                    DomainUsername = "M_BLACKWOOD\\Domain Users",
                    AccountName = "Unknown",
                    IsActive = false,
                    IsAdmin = false,
                    IsPayrollUser = false,
                    DefaultTeamCode = 0,
                    CanAuthoriseAdjustments = false,
                    CanRejectAdjustments = false,
                    IsAssessmentUser = false
                };
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