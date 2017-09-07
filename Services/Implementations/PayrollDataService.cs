namespace Blackwood.Access.Services
{
    using Microsoft.EntityFrameworkCore;
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;

    public class PayrollDataService : IPayrollDataService
    {
        AccessContext _context;

        public PayrollDataService(AccessContext context)
        {
            _context = context;
        }

        public ICollection<Availability> GetActualAvailability(int carerCode, DateTime weekCommencing)
        {
            return _context.Set<Availability>()
                .FromSql("GetCarerActualAvailability @CarerCode, @WeekCommencing",
                    parameters: new[]
                        { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }
                ).AsNoTracking().ToList();
        }

        public IQueryable<Adjustment> GetAllAdjustments()
        {
            return _context.Adjustments;
        }

        public ICollection<CarerBooking> GetBookings(int carerCode, DateTime periodStart, DateTime periodFinish)
        {
            return _context.Set<CarerBooking>().FromSql("GetCarerBookings @CarerCode, @PeriodStart, @PeriodFinish",
                    parameters: new[]
                    {
                        new SqlParameter("@CarerCode", carerCode),
                        new SqlParameter("@PeriodStart", periodStart),
                        new SqlParameter("@PeriodFinish", periodFinish)
                    }
                ).AsNoTracking().ToList();
        }

        public Carer GetCarerByCode(int carerCode)
        {
            return _context.Carers.FirstOrDefault(c => c.CarerCode == carerCode);
        }

        public ICollection<Carer> GetCarers()
        {
            return _context.Carers.OrderBy(c => c.Forename).ThenBy(c => c.Surname).ToList();
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
                ).OrderBy(c => c.Forename).ThenBy(c => c.Surname).AsNoTracking().ToList();
        }

        public ICollection<CarerContract> GetContracts(int carerCode, DateTime periodStart)
        {
            return _context.Set<CarerContract>()
                .FromSql("GetCarerContractInfo @CarerCode, @WeekCommencing",
                    parameters: new[]
                    { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", periodStart) }
                ).AsNoTracking().ToList();
        }

        public IQueryable<PayrollCodeMap> GetPayrollCodeMap()
        {
            return _context.PayrollCodeMap;
        }

        public ICollection<Availability> GetScheduledAvailability(int carerCode, DateTime weekCommencing)
        {
            return _context.Set<Availability>()
                .FromSql("GetCarerScheduledAvailability @CarerCode, @WeekCommencing",
                    parameters: new[]
                    { new SqlParameter("@CarerCode", carerCode), new SqlParameter("@WeekCommencing", weekCommencing) }
                ).AsNoTracking().ToList();
        }

        public ICollection<Summary> GetSummaries(int teamCode, DateTime periodStart, DateTime periodFinish)
        {
            return _context.Set<Summary>()
                .FromSql("GetTeamTimesheetSummary @teamCode, @periodStart, @periodEnd",
                    parameters: new[]
                    {
                        new SqlParameter("@teamCode", teamCode),
                        new SqlParameter("@periodStart", periodStart),
                        new SqlParameter("@periodEnd", periodFinish)
                    }
                ).AsNoTracking().ToList();
        }

        public ICollection<Team> GetTeams()
        {
            return _context.Set<Team>().FromSql("GetTeams").OrderBy(t => t.TeamDesc).AsNoTracking().ToList();
        }

        public ICollection<Adjustment> GetTimesheetAdjustments(int carerCode, DateTime periodStart, DateTime periodFinish)
        {
            return _context.Set<Adjustment>().FromSql("GetTimesheetAdjustments @CarerCode, @PeriodStart, @PeriodFinish",
                    parameters: new[]
                    {
                        new SqlParameter("@CarerCode", carerCode),
                        new SqlParameter("@PeriodStart", periodStart),
                        new SqlParameter("@PeriodFinish", periodFinish)
                    }
                ).AsNoTracking().ToList();
        }

        public ICollection<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd)
        {
            return _context.Set<Adjustment>().FromSql("GetTimesheetAdjustmentsByTeam @TeamCode, @PeriodStart, @PeriodEnd",
                    parameters: new[]
                    {
                        new SqlParameter("@TeamCode", teamCode),
                        new SqlParameter("@PeriodStart", periodStart),
                        new SqlParameter("@PeriodEnd", periodEnd)
                    }
                ).AsNoTracking().ToList();
        }

        public void PutTimesheetAdjustment(Adjustment adj)
        {
            _context.Database.ExecuteSqlCommand("PutTimesheetAdjustment @Id, @Guid, @CarerCode, @WeekCommencing, @RequestedBy, @Requested, @AuthorisedBy, @Authorised, @RejectedBy, @Rejected, @ContractCode, @DayOffset, @Reason, @Hours, @Mins",
                new[] {
                    new SqlParameter { ParameterName = "@Id", Value = adj.Id },
                    new SqlParameter { ParameterName = "@Guid", Value = adj.Guid },
                    new SqlParameter { ParameterName = "@CarerCode", Value = adj.CarerCode },
                    new SqlParameter { ParameterName = "@WeekCommencing", Value = adj.WeekCommencing },
                    new SqlParameter { ParameterName = "@RequestedBy", Value = adj.RequestedBy ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@Requested", SqlDbType = SqlDbType.DateTime2, Value = adj.Requested ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@AuthorisedBy",  Value = adj.AuthorisedBy ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@Authorised", SqlDbType = SqlDbType.DateTime2, Value=adj.Authorised ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@RejectedBy", Value = adj.RejectedBy ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@Rejected", SqlDbType = SqlDbType.DateTime2, Value = adj.Rejected ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@ContractCode", Value = adj.ContractCode },
                    new SqlParameter { ParameterName = "@DayOffset", Value = adj.DayOffset },
                    new SqlParameter { ParameterName = "@Reason", Value = adj.Reason ?? (object)DBNull.Value },
                    new SqlParameter { ParameterName = "@Hours", Value = adj.Hours },
                    new SqlParameter { ParameterName = "@Mins", Value = adj.Mins }
                });
        }

        public void RemoveTimesheetAdjustment(int id)
        {
            _context.Database.ExecuteSqlCommand("RemoveTimeSheetAdjustment @AdjustId", new[] {
                new SqlParameter("@AdjustId", id)
            });
        }

        public WorkPattern WorkPattern(int carer)
        {
            string[] days = { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
            //int[] carers = { 2043, 1542, 5335, 2588, 1544, 1522, 5150, 3476, 1836, 3832, 3492, 3081, 3147, 3153, 3221, 1547, 5320, 3502 };
            //carers.ToList().ForEach(carer =>
            //{
            WorkPattern pat = new WorkPattern();
            pat.Carer = _context.Carers.FirstOrDefault(c => c.CarerCode == carer);
            pat.Contracts = GetContracts(carer, DateTime.Now).ToList();

            pat.Contracts.ForEach(contract =>
                {
                    for (int i = 0; i <= contract.CycleLength; i++)
                    {
                        List<Availability> contractAvail = GetScheduledAvailability(carer, contract.CycleStart.AddDays(i * 7)).ToList();
                        var avail = Tuple.Create(i, contractAvail.ToList());
                        if (contractAvail.Count > 0 && !pat.Schedule.Any(sch => sch.Item1 == avail.Item1)) pat.Schedule.Add(avail);
                    }
                });

            for (int i = 0; i <= pat.Contracts.Max(con => con.CycleLength); i++)
            {
                for (int j = 1; j <= 7; j++)
                {
                    Availability dayAvail = pat.Schedule.FirstOrDefault(sch => sch.Item1 == i)
                        .Item2.FirstOrDefault(av => (int)av.ThisStart.DayOfWeek == j);
                    pat.Pattern.Add(new WorkPattern.Display()
                    {
                        CycleWeek = i + 1,
                        DayOfWeek = days[j - 1],
                        StartTime = dayAvail == null ? TimeSpan.FromMinutes(0) : dayAvail.ThisStart.TimeOfDay,
                        FinishTime = dayAvail == null ? TimeSpan.FromMinutes(0) : dayAvail.ThisFinish.TimeOfDay,
                        Duration = dayAvail == null ? TimeSpan.FromMinutes(0) : dayAvail.ThisFinish - dayAvail.ThisStart
                    });
                }
            }

            return pat;
            //});
        }
    }
}
