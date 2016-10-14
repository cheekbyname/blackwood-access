import { Carer } from './Carer';
import { CarerContract } from './Contract';
import { Availability } from './Availability';
import { CarerBooking } from './Booking';

export class Timesheet {
	public CarerCode: number;
	public WeekCommencing: Date;
	public Carer: Carer;
	public Contracts: CarerContract[];
	public ScheduledAvailability: Availability[];
	public ActualAvailability: Availability[];
	public Bookings: CarerBooking[];
}