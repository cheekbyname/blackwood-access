import { Carer } from './Carer';
import { CarerContract } from './Contract';
import { Availability } from './Availability';
import { CarerBooking } from './Booking';
import { Shift } from './Shift';
import { Adjustment } from './Adjustment';

export class Timesheet {
	public carerCode: number;
	public weekCommencing: Date;
	public carer: Carer;
	public contracts: CarerContract[];
	public scheduledAvailability: Availability[];
	public actualAvailability: Availability[];
	public bookings: CarerBooking[];
	public shifts: Shift[];
	public adjustments: Adjustment[];
}