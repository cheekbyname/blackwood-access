namespace Blackwood.Access.Models {
    using System;

    public class TimesheetAdjustment {
        public int Id { get; set; }
        public int CarerCode { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public string Reason { get; set; }
        public string RequestedBy { get; set; }
        public DateTime Requested { get; set; }
        public string AuthorisedBy { get; set; }
        public DateTime Authorised { get; set; }
    }
}

