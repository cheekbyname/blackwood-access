import { Guid } from "../Utilities";

export class UserMap {
    public id: number;
    public staffPlanPersonCode: number;
    public staffPlanHash: string;
    public careSysGuid: Guid;
    public enableSync: boolean;
    public notified: boolean;
}