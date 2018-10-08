import { Availability } from "./Availability";
import { Team } from "./Team";

export class CarerContract {
	public payrollNumber: string;
	public carerCode: number;
	public contractCode: number;
	public cycleStart: Date;
	public cycleLength: number;
	public cycleWeek: number;
	public contractMins: number;
	public limitMins: number;
	public teamCode: number;
	public teamDesc: string;
    public costCentre: string;
    public carerGradeCode: number;
	public carerGradeDesc: string;
	public cycleDaysWorked: number;
	public breakPolicyId: number;
	public schedMins: number;

	public scheduledAvailability: Availability[] = [];
	public team: Team;
}