import { Guid } from "../Utilities";
import { Team } from "./Team";
import { CarerContract } from "./Contract";

export class Carer {
	public personnelNumber: string;
	public carerCode: number;
	public forename: string;
	public surname: string;
	public email: string;
	public careSysGuid: Guid;
	public defaultTeamCode: number;

	public defaultTeam: Team;

	public contracts: CarerContract[];
}