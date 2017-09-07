namespace Blackwood.Access.Services
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class PayrollShiftService : IPayrollShiftService
    {
        IPayrollDataService _dataService;
        private int[] _absenceCodes;
        private int[] _unpaidCodes;
        List<PayrollCodeMap> _codeMap;

        public PayrollShiftService(IPayrollDataService dataService)
        {
            _dataService = dataService;
            _codeMap = _dataService.GetPayrollCodeMap().ToList();

            _unpaidCodes = _codeMap.Where(map => map.Type == 0 && !(map.PayHours ?? false))
                .Select(map => map.TypeCode).ToArray();
            _absenceCodes = _codeMap.Where(map => map.Type == 0 && (map.PayHours ?? false) && !(map.ShiftCode ?? false))
                .Select(map => map.TypeCode).ToArray();
        }

        // Establish Shifts for each day in period
        // Definitions:
        // A Shift is a block of contiguous time within an Availability block which contains one or more Bookings
        // The Shift starts at the beginning of the Availability block or the first Booking, which ever is earliest NOT IN USE
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
                    Day = day
                };

                bookings.Where(bk => bk.ThisStart.Date == dt && !_absenceCodes.Any(ac => ac == bk.BookingType))
                    .OrderBy(bk => bk.ThisStart).ToList().ForEach(bk => {

                        // Retrieve Booking & Availability Type code maps
                        PayrollCodeMap bkMap = _codeMap.FirstOrDefault(map => map.Type == 0 && map.TypeCode == bk.BookingType);
                        PayrollCodeMap avMap = _codeMap.FirstOrDefault(map => map.Type == 1 && map.TypeCode == bk.AvailType);

                        // Calculate gap from last booking and adjust Shift Start/Finish times
                        gap = (bk.ThisStart - shift.Finish) ?? TimeSpan.FromMinutes(0);

                        // Track biggest (total?) gap for fitting breaks in
                        shift.BiggestGap = Math.Max((int)gap.TotalMinutes, shift.BiggestGap);

                        shift.ContractCode = shift.ContractCode ?? bk.ContractCode;
                        shift.Start = shift.Start ?? bk.ThisStart;

                        //  Check for Unpaid Break Booking Type
                        if (_unpaidCodes.Any(uc => uc == bk.BookingType))
                        {
                            shift.UnpaidMins += (bk.ThisMins);
                        }
                        else
                        {
                            shift.ShiftMins += bk.ThisMins;
                        }
                        // Begin new Shift if valid shift break detected
                        if (gap >= TimeSpan.FromHours(2))
                            // || !bkMap.ShiftCode
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
                                ContractCode = bk.ContractCode
                            };
                        }
                        else
                        {
                            shift.Finish = bk.ThisFinish;
                            if (avMap.PayGaps ?? false)
                            {
                                // Shift time from beginning to end minus unpaid breaks
                                shift.ShiftMins = (int)((shift.Finish - shift.Start).Value.TotalMinutes) - shift.UnpaidMins;
                            }
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
                else
                {
                    shift.ValidBreak = true;
                }
            });

            return shifts;
        }
    }
}
