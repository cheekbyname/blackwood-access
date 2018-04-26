import { Service } from "../reporting/Service";
import { LocalAuthority } from "../reporting/LocalAuthority";

export class Team {
	public id: number;
	public teamCode: number;
	public caresyslocationguid: string;
	public teamDesc: string;
	public enableSync: true;
	public primaryContact: string;
	public costCentre: string;
	public breakPolicy: number;
	public locAuthRef: string;

	public localAuthority: LocalAuthority;

	// Deprecated, to be removed in due course
	public serviceId: number;
	public service: Service;
}