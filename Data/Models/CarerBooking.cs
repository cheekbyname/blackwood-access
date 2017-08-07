namespace Blackwood.Access.Models {
    using System;
    using System.ComponentModel.DataAnnotations;

    public class CarerBooking {
		[Key]
		public int BookingCode {get;set;}
		public int ContractCode {get;set;}
		public DateTime ThisStart {get;set;}
		public DateTime ThisFinish {get;set;}
		public int ThisMins {get;set;}
		public int BookingType {get;set;}
		public string BookingDesc {get;set;}
		public string Forename {get;set;}
		public string Surname {get;set;}
		public int Shift { get; set; }
		public short? TeamCode { get; set;}
		public string TeamDesc { get; set; }
        public short? AvailType { get; set; }
        public string AvailDesc { get; set; }
	}
}