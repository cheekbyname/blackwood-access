import { Run } from "./Run";

export class CarerBooking {
	public bookingCode: number;
	public contractCode: number;
	public thisStart: Date;
	public thisFinish: Date;
	public thisMins: number;
	public bookingType: number;
	public bookingDesc: string;
	public forename: string;
	public surname: string;
    public shift: number;
    public availType: number;
	public availDesc: string;
	public isSynthetic: boolean;
	public runCode: number;

	public run: Run;
}