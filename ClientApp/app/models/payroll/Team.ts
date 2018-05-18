import { Service } from "../reporting/Service";
import { LocalAuthority } from "../reporting/LocalAuthority";
import { Guid } from "../Utilities";
import { ServiceLocation } from "./ServiceLocation";

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

	public localAuthority: LocalAuthority;
	public serviceLocation: ServiceLocation;

	// Deprecated, to be removed in due course
	public serviceId: number;
	public service: Service;
}