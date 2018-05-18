import { Guid } from "../Utilities";
import { Team } from "./Team";

export class ServiceLocation {
    public guid: Guid;
    public name: string;
    public exportLedgerName: string;
    public costCentre: string;
    public staffPlanTeamCode: number;

    public team: Team;
}