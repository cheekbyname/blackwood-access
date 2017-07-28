namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Collections.Generic;

    public interface IPayrollShiftService
    {
        ICollection<Shift> BookingsToShifts(DateTime startDate, DateTime finishDate, ICollection<CarerBooking> bookings, int carerCode);
    }
}
