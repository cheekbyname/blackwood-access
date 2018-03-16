import { Guid } from "../Utilities";

export class Carer {
	public personnelNumber: string;
	public carerCode: number;
	public forename: string;
	public surname: string;
	public email: string;
	public careSysGuid: Guid;
	public defaultTeamCode: number;
}