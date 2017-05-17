namespace Blackwood.Access.Models
{
	using System;
	using System.ComponentModel.DataAnnotations;

	public class Team
	{
		// public int ID { get; set;}

		[Key]
		public Int16 TeamCode { get; set; }

		// public Guid CareSysLocationGuid { get; set; }

		public string TeamDesc { get; set; }

		// public bool EnableSync { get; set; }

		// public string PrimaryContact { get; set; }
	}
}