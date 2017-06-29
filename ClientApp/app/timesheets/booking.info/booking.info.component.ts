import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CarerBooking } from '../../models/booking';
import { CarerContract } from '../../models/contract';

@Component({
    selector: 'booking-info',
    template: require('./booking.info.component.html')
})
export class BookingInfoComponent {
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

    // TODO Move these methods to provider for convenience
    public timeFromDate(dt: string): string {
        var ndt = new Date(dt);
        var hr = "0" + ndt.getHours();
        var mn = "0" + ndt.getMinutes();
        return hr.substr(hr.length - 2) + ":" + mn.substr(mn.length - 2);
    }

	public displayTime(mins: number): string {
		if (mins < 0) {
			return Math.ceil(mins/60) + "h " + (mins % 60) + "m";
		}
		return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
	}

	public teamForContract(contractCode: number): string {
		var contract = this.contracts.find(con => con.contractCode === contractCode);
		return contract ? contract.teamDesc : "";
	}
}