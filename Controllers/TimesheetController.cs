namespace Blackwood.Access.Controllers
{
	using System;
	using System.Collections.Generic;
	using Blackwood.Access.Models;
	using Blackwood.Access.Services;
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
		public IEnumerable<Carer> Carers()
		{
			return _service.GetCarers();
		}

		[HttpGet("[action]")]
		public Timesheet Timesheet(int carerCode, DateTime weekCommencing)
		{
			return _service.GetTimesheet(carerCode, weekCommencing);
		}
	}
}