namespace Blackwood.Access.Services
{
    using Microsoft.EntityFrameworkCore;
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Threading.Tasks;

    public class PayrollDataService : IPayrollDataService
    {
        AccessContext _context;

        public PayrollDataService(AccessContext context)
        {
            _context = context;
        }

        public ICollection<Carer> GetCarersByTeam(int TeamCode, DateTime? periodStart)
        {
            return _context.Set<Carer>().FromSql("GetCarersByTeam @TeamCode, @PeriodStart",
                parameters: new[]
                    {
                        new SqlParameter("@TeamCode", TeamCode),
                        new SqlParameter()
                        {
                            ParameterName = "@PeriodStart", SqlDbType = SqlDbType.Date, Value = periodStart ?? (object)DBNull.Value
                        }
                    }
                ).OrderBy(c => c.Forename).ThenBy(c => c.Surname).ToList();
        }
    }
}
