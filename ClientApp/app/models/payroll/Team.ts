import { Guid } from "../Utilities";

import { LocalAuthority } from "../reporting/LocalAuthority";
import { Service } from "../reporting/Service";
import { ServiceLocation } from "./ServiceLocation";
import { TeamUser } from "../integration/TeamUser";

export class Team {
	public id: number;
	public teamCode: number;
	public caresysLocationGuid: Guid;
	public teamDesc: string;
	public enableSync: true;
	public primaryContact: string;
	public costCentre: string;
	public breakPolicy: number;
	public locAuthRef: string;
	public hourlyCalc: HourlyCalc;

	public localAuthority: LocalAuthority;
	public serviceLocation: ServiceLocation;

	public teamUsers: TeamUser[];
	
	// Deprecated, to be removed in due course
	public serviceId: number;
	public service: Service;
}

export enum HourlyCalc {
	ContractedAverage = 0,
	ScheduledAvail = 1
}