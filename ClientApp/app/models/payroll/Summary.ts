import { Carer } from "./Carer";
import { CarerBooking } from "./Booking";
import { Shift } from "./Shift";
import { Availability } from "./Availability";
import { CarerContract } from "./Contract";

export class Summary {
	public carerCode: number;
	public forename: string;
	public surname: string;
	public personnelNumber: string;
	public contractCode: string;
	public payrollNumber: string;
	public costCentre: string;
	public periodContractMins: number;
	public monthlyLimitMins: number;
	public superTrainMins: number;
	public leaveSickMins: number;
	public contactTimeMins: number;
	public actualMins: number;
	public totalMins: number;
    public availMins: number;
	public unpaidMins: number;
	public isManager: boolean;
	public toilBalance: number;
	public toilDelta: number;

	public teamCode: number;
	public teamDesc: string;
	public locAuthRef: string;
	public locAuthName: string;
	public serviceId: number;
	public serviceName: string;
	public regionId: number;
	public regionName: string;

	public bookings: CarerBooking[];
	public shifts: Shift[];
	public unmappedForAnalysis: CarerBooking[];
	public scheduledAvailability: Availability[];
	public actualAvailability: Availability[];
	public carer: Carer;
	public contract: CarerContract;
	
	public downTime: number;
	public additionalMins: number;
	public positionType: string;
	public periodSchedMins: number;
	public effectContractMins: number;

    // Analysis Values
    public annualLeave: number;
    public maternityOtherLeave: number;
    public sicknessAbsence: number;
    public travelTime: number;
    public shadowing: number;
    public supervision: number;
    public teamMeetings: number;
    public training: number;
    public contact: number;
	public nonContact: number;
	public unpaid: number;
}