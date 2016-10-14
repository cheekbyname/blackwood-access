namespace Blackwood.Access.Models {
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Availability {
		[Key]
		public int AvailCode {get;set;}
		public int ContractCode {get;set;}
		public DateTime ThisStart {get;set;}
		public DateTime ThisFinish {get;set;}
		public int ThisMins {get;set;}
		public int AvailType {get;set;}
		public string AvailDesc {get;set;}
	}
}