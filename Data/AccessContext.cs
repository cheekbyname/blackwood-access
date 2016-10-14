namespace Blackwood.Access
{
	using Microsoft.EntityFrameworkCore;
	using Blackwood.Access.Models;

    public class AccessContext : DbContext {

		public AccessContext(DbContextOptions<AccessContext> options) : base(options) { }
		
		public DbSet<Carer> Carers {get;set;}
		public DbSet<CarerContract> CarerContracts {get;set;}
		// public DbSet<Availability> Availabilities {get;set;}
		// public DbSet<CarerBooking> CarerBookings {get;set;}
	}
}
