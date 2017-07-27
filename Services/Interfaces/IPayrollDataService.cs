namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Collections.Generic;

    public interface IPayrollDataService
    {
        ICollection<Carer> GetCarersByTeam(int teamCode, DateTime? periodStart);
    }
}
