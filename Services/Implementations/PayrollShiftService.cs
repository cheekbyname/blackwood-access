namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class PayrollShiftService : IPayrollShiftService
    {
        IPayrollDataService _dataService;
        // TODO - Replace these two with PayrollCodeMap entries
        private int[] _absenceCodes = { 108, 109 };
        private int[] _unpaidCodes;

        public PayrollShiftService(IPayrollDataService dataService)
        {
            _dataService = dataService;

            _unpaidCodes = _dataService.GetPayrollCodeMap()
                .Where(map => map.Type == 0 && !map.PayHours).Select(map => map.TypeCode).ToArray();
            // TODO Do something similar for _absenceCodes?
        }

        // Establish Shifts for each day in period
        // Definitions:
        // A Shift is a block of contiguous time within an Availability block which contains one or more Bookings
        // The Shift starts at the beginning of the Availability block or the first Booking, which ever is earliest
        // The Shift finishes at the end of the end of the last booking in that Shift, if the first Shift
        // The Shift finishes at the end of the Availability block if the second Shift 
        // A Shift which contains a gap of two hours or more should be split into two Shifts
        // !But only if at least part of that gap falls between 2PM and 4PM!
        // The first Shift ends at the end of the last Booking before the split
        // The second Shift begins at the beginning of the first booking after the split
        // The actual hours paid are counted from the beginning of the Shift to the finish of it
        // Any Shift of four hours or more is deducted thirty minutes as an unpaid break

        public ICollection<Shift> BookingsToShifts(DateTime startDate, DateTime finishDate, ICollection<CarerBooking> bookings, int carerCode)
        {
            List<DateTime> dates = Enumerable.Range(0, (finishDate - startDate).Days + 1).Select(d => startDate.AddDays(d)).ToList();
            List<Shift> shifts = new List<Shift>();

            dates.ForEach(dt => {
                TimeSpan gap;
                int day = dates.IndexOf(dt);

                // First Shift of this day
                Shift shift = new Shift()
                {
                    CarerCode = carerCode,
                    Sequence = 1,
                    Day = day,
                    UnpaidMins = 0,
                    BiggestGap = 0
                };

                bookings.Where(bk => bk.ThisStart.Date == dt && !_absenceCodes.Any(ac => ac == bk.BookingType))
                    .OrderBy(bk => bk.ThisStart).ToList().ForEach(bk => {

                        // Calculate gap from last booking and adjust Shift Start/Finish times
                        gap = (bk.ThisStart - shift.Finish) ?? TimeSpan.FromMinutes(0);
                        shift.BiggestGap = Math.Max((int)gap.TotalMinutes, shift.BiggestGap);
                        shift.ContractCode = shift.ContractCode ?? bk.ContractCode;
                        shift.Start = shift.Start ?? bk.ThisStart;

                        //  Check for Unpaid Break Booking Type
                        if (_unpaidCodes.Any(uc => uc == bk.BookingType))
                        {
                            shift.UnpaidMins += (bk.ThisMins);
                        }
                        // Begin new Shift if valid shift break detected
                        // TODO Think about this contract change thing
                        if (gap >= TimeSpan.FromHours(2))
                            // TODO Or Booking is not of a Shiftable type
                            // && ((bk.ThisStart.Hour >= 14 && bk.ThisStart.Hour <= 16) 
                            // 	|| (bk.ThisFinish.Hour >= 14 && bk.ThisFinish.Hour <= 16 )))
                            // TODO This is problematic || bk.ContractCode != shift.ContractCode)
                        {
                            shifts.Add(shift);
                            shift = new Shift()
                            {
                                CarerCode = carerCode,
                                Sequence = shifts.Where(sh => sh.Day == day).Select(sh => sh.Sequence).Max() + 1,
                                Day = day,
                                Start = bk.ThisStart,
                                ContractCode = bk.ContractCode,
                                BiggestGap = 0
                            };
                        }
                        else
                        {
                            shift.Finish = bk.ThisFinish;
                            // Shift time from beginning to end minus unpaid breaks
                            shift.ShiftMins = (int)((shift.Finish - shift.Start).Value.TotalMinutes) - shift.UnpaidMins;
                        }

                        // Tag Booking with Shift Sequence
                        bk.Shift = shift.Sequence;
                    });
                shifts.Add(shift);
            });

            // Strip out blank Shifts
            shifts = shifts.Where(sh => sh.Start != null && sh.Finish != null).ToList();

            shifts.ForEach(shift =>
            {
                // Check that Shift had valid break
                // TODO Get ShiftBreak profile
                // TODO Implement BreakPolicy, with legal minimums by default
                if (shift.ShiftMins >= 360 && shift.UnpaidMins < 20)
                {
                    if (shift.BiggestGap < 20)
                    {
                        shift.ValidBreak = false;
                    }
                    else
                    {
                        shift.ValidBreak = true;
                        // TODO Add an Adjustment or just increment UnpaidMins?
                        shift.UnpaidMins += 20;
                    }
                }
            });

            return shifts;
        }
    }
}
