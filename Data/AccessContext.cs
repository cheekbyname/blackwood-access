namespace Blackwood.Access
{
	using Microsoft.EntityFrameworkCore;
	using Blackwood.Access.Models;

	// NB This Context for reading only, these entities do not exist on the database except as Views or Stored Procedures
    public class AccessContext : DbContext {

		public AccessContext(DbContextOptions<AccessContext> options) : base(options) { }

		public DbSet<AccessUser> AccessUsers { get; set; }
		public DbSet<Team> Teams { get; set; }
		public DbSet<Carer> Carers { get; set; }
		public DbSet<CarerContract> CarerContracts { get; set; }
		public DbSet<Availability> Availabilities { get; set; }
		public DbSet<CarerBooking> CarerBookings { get; set; }
		public DbSet<Summary> Summaries { get; set; }
        public DbSet<CareInitialAssessment> CareInitialAssessments { get; set; }
        public DbSet<ActiveUser> ActiveUsers { get; set; }
        public DbSet<CheckItem> CheckItems { get; set; }
        public DbSet<CommsItem> CommsItems { get; set; }
        public DbSet<TileGroup> TileGroups { get; set; }
        public DbSet<TileItem> TileItems { get; set; }
		public DbSet<Adjustment> Adjustments { get; set; }
		public DbSet<PayrollCodeMap> PayrollCodeMap { get; set; }
	}
}
