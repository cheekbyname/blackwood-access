import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { CarerBooking } from '../../models/payroll/Booking';
import { CarerContract } from '../../models/payroll/Contract';

import { PayrollProvider } from '../payroll.provider';

@Component({
    selector: 'booking-detail',
    templateUrl: './booking.detail.component.html',
    styleUrls: ['./booking.detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BookingDetailComponent {

    constructor(public payPro: PayrollProvider) {

    }

    _bookingVisible: boolean;
    _booking: CarerBooking;
    _contracts: CarerContract[];

    @Input()
    set bookingVisible(vis: boolean) { this._bookingVisible = vis; }
    get bookingVisible(): boolean { return this._bookingVisible; }

    @Output()
    bookingVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set booking(bk: CarerBooking) { this._booking = bk; }
    get booking(): CarerBooking { return this._booking; }

    @Input()
    set contracts(cons: CarerContract[]) { this._contracts = cons; }
    get contracts(): CarerContract[] { return this._contracts; }

    public close() {
        this.bookingVisible = false;
        this.bookingVisibleChange.emit(this.bookingVisible);
    }
}