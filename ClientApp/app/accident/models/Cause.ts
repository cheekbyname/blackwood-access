import { SummaryOfCause } from "./SummaryOfCause";

export class Cause {
    public id: number;
    public description: string;
    public order: number;

    public summaryOfCauses: SummaryOfCause[];
}