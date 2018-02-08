import { Scope, Frequency, Direction } from "./Enums";
import { Report } from "./Report";
import { ReportingRegion } from "./ReportingRegion";
import { Service } from "./Service";
import { Team } from "../Team";
import { ScheduleFilter } from "./ScheduleFilter";
import { Subscription } from "./Subscription";

export class Schedule {
    public id: number;
    public reportId: number;
    public scope: Scope;
    public frequency: Frequency;
    public period: Frequency;
    public direction: Direction;
    public runTime: Date;
    public regionId: number;
    public serviceId: number;
    public teamId: number;

    public report: Report;
    public region: ReportingRegion;
    public service: Service;
    public team: Team;

    public subscriptions: Subscription[];
    public filters: ScheduleFilter[];

    public runPeriod: { item1: Date, item2: Date }

    constructor() {
        this.runTime = new Date(this.runTime);
        this.runPeriod.item1 = new Date(this.runPeriod.item1);
        this.runPeriod.item2 = new Date(this.runPeriod.item2);
    }

    // public get NextRun(): Date {
    //     switch(this.frequency) {
    //         case Frequency.Hourly:
    //             return this.runTime;    // Add 1 Hour
    //         case Frequency.Daily:
    //             return this.runTime;    // Add 1 Day
    //         case  Frequency.Weekly:
    //             return this.runTime;    // Add 7 Days
    //         case Frequency.Monthly:
    //             return this.runTime;    // Add 1 Month
    //         case Frequency.Quarterly:
    //             return this.runTime;    // Add 3 Months
    //         default:
    //             return new Date();
    //     }
    // }

    // public get RunPeriod(): { Start: Date, End: Date }  {
    //     var periodStart: Date;
    //     var periodEnd: Date;
    //     let now: Date = new Date();

    //     switch(this.period) {
    //         case Frequency.Weekly:
    //             // TODO
    //             break;
    //         case Frequency.Monthly:
    //             // TODO
    //             break;
    //         default:
    //             break;
    //     }
    //     return { Start: periodStart, End: periodEnd };
    // }

    public get ScopeDescription(): string {
        return "TODO";
    }

    public get ReportRequestUri(): string {
        var baseUrl: string = "https://hof-iis-live-01.m-blackwood.mbha.org.uk:444/api/reporting/report";
        var reportUrl: string = `${baseUrl}?reportId=${this.reportId}&periodStart=${this.runPeriod.item1.toISOString()}&periodEnd=${this.runPeriod.item2.toISOString()}`;

        switch(this.scope) {
            case Scope.Team:
                reportUrl += "&teamCode=" + this.teamId;
                break;
            default:
                break;
        }
        return reportUrl;
    }
}