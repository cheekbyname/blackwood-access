import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { PayrollCodeMap } from "./PayrollCodeMap";
import { CarerBooking } from './Booking';

export class Shift {
    public id: number;
    public carerCode: number;
    public contractCode: number;
    public sequence: number;
    public day: number;
    public start: Date;
    public finish: Date;
    public shiftMins: number;
    public unpaidMins: number;
    public validBreak: boolean;
    public breakPolicyId: number;

    public bookings: CarerBooking[];
    public availabilityType: PayrollCodeMap;
}

@Pipe({
    name: 'shiftOffsetFilter'
})
@Injectable()
export class ShiftOffsetFilter implements PipeTransform {
    public transform(shifts: Shift[], offset:number): Shift[] {
        return shifts.filter(shift => shift.day == offset);
    }
}