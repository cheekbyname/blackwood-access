import { Cause } from "./Cause";
import { Incident } from "./Incident";

export class SummaryOfCause {
    public id: number;
    public incidentId: number;
    public causeId: number;
    public otherCauseDetails: string;

    public incident: Incident;
    public cause: Cause;
}