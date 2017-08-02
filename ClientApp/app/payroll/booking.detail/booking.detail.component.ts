import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { CarerBooking } from '../../models/booking';
import { CarerContract } from '../../models/contract';

import { PayrollProvider } from '../payroll.provider';

@Component({
    selector: 'booking-detail',
    template: require('./booking.detail.component.html'),
    styles: [require('./booking.detail.component.css')],
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