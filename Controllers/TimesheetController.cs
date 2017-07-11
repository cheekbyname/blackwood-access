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
		public IEnumerable<Carer> CarersByTeam(int TeamCode, DateTime periodStart)
		{
            return _service.GetCarersByTeam(TeamCode, periodStart);
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
			return _service.AddTimesheetAdjustment(adj, HttpContext.User);
		}

		[HttpDelete("[action]")]
		public void RemoveTimesheetAdjustment(int id)
		{
			_service.RemoveTimesheetAdjustment(id);
		}

		[HttpPut("[action]")]
		public void UpdateTimesheetAdjustment([FromBody] Adjustment adj)
		{
			_service.AddTimesheetAdjustment(adj, HttpContext.User);	// Don't need to return the ID for updates
		}

		[HttpGet("[action]")]
		public IEnumerable<Adjustment> GetTimesheetAdjustmentsByTeam(int teamCode, DateTime periodStart, DateTime periodEnd)
		{
			return _service.GetTimesheetAdjustmentsByTeam(teamCode, periodStart, periodEnd);
		}
	}
}