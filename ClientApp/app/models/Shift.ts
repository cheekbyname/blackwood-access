import { Injectable, Pipe, PipeTransform } from '@angular/core';

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
}

@Pipe({
    name: 'shiftOffsetFilter'
})
@Injectable()
export class ShiftOffsetFilter implements PipeTransform {
    transform(shifts: Shift[], offset:number): Shift[] {
        return shifts.filter(shift => shift.day == offset);
    }
}