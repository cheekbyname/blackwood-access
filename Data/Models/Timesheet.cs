namespace Blackwood.Access.Models {
    using System;
    using System.Collections.Generic;

    public class Timesheet {
		
		public int CarerCode { get; set; }
		public DateTime WeekCommencing { get;set; }
		public Carer Carer { get; set; }
		public ICollection<CarerContract> Contracts { get; set; }
		public ICollection<Availability> ScheduledAvailability { get; set; }
		public ICollection<Availability> ActualAvailability { get; set; }
		public ICollection<CarerBooking> Bookings { get; set; }

	}
}