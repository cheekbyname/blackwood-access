import { Component, Input } from '@angular/core';

import { CarerBooking } from '../../models/payroll/Booking';
import { ToilSetting } from '../../models/payroll/PayrollCodeMap';

@Component({
    selector: 'booking-card',
    templateUrl: './booking.card.html',
    styleUrls: ['booking.card.css']
})
export class BookingCardComponent {
    @Input()
    booking: CarerBooking;

    toilSetting = ToilSetting;

    displayTime(dt: Date): string {
        var ndt = new Date(dt);
        var hr = "0" + ndt.getHours();
        var mn = "0" + ndt.getMinutes();
        return hr.substr(hr.length - 2) + ":" + mn.substr(mn.length - 2);
    }
}
