import { Carer } from "./Carer";

export class Summary {
	public carerCode: number;
	public forename: string;
	public surname: string;
	public personnelNumber: string;
	public contractCode: string;
	public payrollNumber: string;
	public teamDesc: string;
	public costCentre: string;
	public periodContractMins: number;
	public periodSchedMins: number;
	public monthlyLimitMins: number;
	public superTrainMins: number;
	public leaveSickMins: number;
	public contactTimeMins: number;
	public actualMins: number;
	public totalMins: number;
    public availMins: number;
	public unpaidMins: number;
	public additionalMins: number;
	// TODO There are others...

	public positionType: string;

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

	public carer: Carer;
}