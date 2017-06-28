using System.ComponentModel.DataAnnotations;

namespace Blackwood.Access.Models
{
	public class Summary
	{
		[Key]
		public int CarerCode { get; set;}
		public string Forename { get; set; }
		public string Surname { get; set;}
		public string PersonnelNumber { get; set;}
		public int ContractCode { get; set; }
		public string PayrollNumber { get; set; }
		public string TeamDesc { get; set; }
		public string CostCentre { get; set; }
		public int MonthlyContractMins { get; set; }
		public int MonthlyLimitMins { get; set; }
		public int SuperTrainMins { get; set; }
		public int LeaveSickMins { get; set; }
		public int ContactTimeMins { get; set; }
		public int ActualMins { get; set; }
		public int TotalMins { get; set; }
		public int AvailMins { get; set; }
	}
}