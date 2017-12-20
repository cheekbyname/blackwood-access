import { Component, Input } from '@angular/core';

import { CarerBooking } from '../../models/Booking';

@Component({
    selector: 'booking-card',
    templateUrl: './booking.card.html'
})
export class BookingCardComponent {
    @Input()
    booking: CarerBooking;

    displayTime(dt: Date): string {
        var ndt = new Date(dt);
        var hr = "0" + ndt.getHours();
        var mn = "0" + ndt.getMinutes();
        return hr.substr(hr.length - 2) + ":" + mn.substr(mn.length - 2);
    }
}