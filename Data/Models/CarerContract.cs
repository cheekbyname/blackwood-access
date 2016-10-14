namespace Blackwood.Access.Models {
    using System;
    using System.ComponentModel.DataAnnotations;

    public class CarerContract {
		public string PayrollNumber {get;set;}
		[Key]
		public int ContractCode {get;set;}
		public DateTime CycleStart {get;set;}
		public int CycleLength {get;set;}
		public int CycleWeek {get;set;}
		public int ContractMins{get;set;}
		public int LimitMins {get;set;}
		public int TeamCode {get;set;}
		public string TeamDesc {get;set;}
		public string CostCentre {get;set;}
	}
}