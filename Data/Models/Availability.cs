namespace Blackwood.Access.Models {
	using System;

	public class Availability {
		public int ContractCode {get;set;}
		public DateTime ThisStart {get;set;}
		public DateTime ThisFinish {get;set;}
		public int ThisMins {get;set;}
		public int AvailType {get;set;}
		public string AvailDesc {get;set;}
	}
}