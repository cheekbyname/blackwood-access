using System.ComponentModel.DataAnnotations;

namespace Blackwood.Access.Models {
	public class Carer {
		public string PersonnelNumber {get;set;}
		[Key]
		public int CarerCode {get;set;}
		public string Forename {get;set;}
		public string Surname{get;set;}
		public string Email{get;set;}
	}
}