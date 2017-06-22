namespace Blackwood.Access.Controllers
{
	using System;
	using System.Collections.Generic;
	using Models;
	using Services;
	using Microsoft.AspNetCore.Mvc;

	[Route("api/[Controller]")]
	public class TimesheetController : ControllerBase
	{
		private ITimesheetService _service;

		public TimesheetController(ITimesheetService service)
		{
			_service = service;
		}

		[HttpGet("[action]")]
		public IEnumerable<Team> Teams()
		{
			return _service.GetTeams();
		}

		[HttpGet("[action]")]
		public IEnumerable<Carer> Carers()
		{
			return _service.GetCarers();
		}

		[HttpGet("[action]")]
		public IEnumerable<Carer> CarersByTeam(int TeamCode)
		{
			return _service.GetCarersByTeam(TeamCode);
		}

		[HttpGet("[action]")]
		public Timesheet Timesheet(int carerCode, DateTime weekCommencing)
		{
			return _service.GetTimesheet(carerCode, weekCommencing);
		}

		[HttpGet("[action]")]
		public IEnumerable<Summary> Summaries(int teamCode, DateTime periodStart, DateTime periodEnd){
			return _service.GetSummaries(teamCode, periodStart, periodEnd);
		}

		[HttpPut("[action]")]
		public Adjustment AddTimesheetAdjustment([FromBody] Adjustment adj)
		{
			return _service.AddTimesheetAdjustment(adj);
		}
	}
}