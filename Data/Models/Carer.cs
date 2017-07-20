namespace Blackwood.Access.Models {
	using System;
	using System.ComponentModel.DataAnnotations;

	public class Carer {
		public string PersonnelNumber { get; set; }
		[Key]
		public int CarerCode { get;set; }
		public string Forename { get; set; }
		public string Surname { get; set; }
		public string Email { get; set; }
		public Guid? CareSysGuid { get; set;}
		public Int16? DefaultTeamCode { get; set; }
	}
}