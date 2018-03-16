import { Service } from "../reporting/Service";

export class Team {
	public id: number;
	public teamCode: number;
	public caresyslocationguid: string;
	public teamDesc: string;
	public enableSync: true;
	public primaryContact: string;
	public costCentre: string;
	public breakPolicy: number;
	public serviceId: number;
	public service: Service;
}