import { Component, Input } from '@angular/core';
import { CarerBooking } from '../../../models/booking';

@Component({
    selector: 'booking-card',
    template: require('./booking.card.html')
})
export class BookingCardComponent {
    @Input()
    booking: CarerBooking;

    displayTime(dt: string): string {
        var ndt = new Date(dt); 
        return ndt.getHours() + ":" + ndt.getMinutes();
    }
}