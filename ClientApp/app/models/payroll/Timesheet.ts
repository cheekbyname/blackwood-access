import { Carer } from './Carer';
import { CarerContract } from './Contract';
import { Availability } from './Availability';
import { CarerBooking } from './Booking';
import { Shift } from './shift';
import { Adjustment } from './Adjustment';
import { BreakPolicy } from "./BreakPolicy";
import { BreakDefinition } from "./BreakDefinition";

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
	public breakPolicies: BreakPolicy[];
	public breakDefinitions: BreakDefinition[];
}