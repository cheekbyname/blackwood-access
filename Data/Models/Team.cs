using System.ComponentModel.DataAnnotations;

namespace Blackwood.Access.Models
{
	public class Team
	{
		[Key]
		public int TeamCode {get;set;}

		public string TeamDesc {get;set;}
	}
}