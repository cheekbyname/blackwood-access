import { Guid } from "../Utilities";
import { Team } from "./Team";

export class Carer {
	public personnelNumber: string;
	public carerCode: number;
	public forename: string;
	public surname: string;
	public email: string;
	public careSysGuid: Guid;
	public defaultTeamCode: number;

	public defaultTeam: Team;
}