import { Report } from "./Report";

export enum Frequency {
    Unknown,
    Immediate,
    Hourly,
    Daily,
    Weekly,
    Monthly,
    Quarterly
}

export enum Direction {
    Unknown,
    Current,
    Previous,
    Next
}

export enum Scope {
    Unknown,
    Team,
    Service,
    Region,
    LocAuth
}

export enum ReportParams {
    Unknown,
    PeriodStart,
    PeriodEnd,
    TeamCode,
    RegionId,
    Frequency,
    RenderType,
    Scope,
    LocAuthRef,
    ServiceId,
    ShowDetail,
    Period
}

export const FREQUENCIES: { key: Frequency, value: string }[] = [
    { key: Frequency.Unknown, value: "" },
    { key: Frequency.Immediate, value: "Immediate" },
    { key: Frequency.Hourly, value: "Hourly" },
    { key: Frequency.Daily, value: "Daily" },
    { key: Frequency.Weekly, value: "Weekly" },
    { key: Frequency.Monthly, value: "Monthly" },
    { key: Frequency.Quarterly, value: "Quarterly" }
];

export const DIRECTIONS: { key: Direction, value: string }[] = [
    { key: Direction.Unknown,  value: "" },
    { key: Direction.Current, value: "Current" },
    { key: Direction.Previous, value: "Previous" },
    { key: Direction.Next, value: "Next" }
];

export const SCOPES: { key: Scope, value: string }[] = [
    { key: Scope.Unknown, value: "" },
    { key: Scope.Team, value: "Team" },
    { key: Scope.Service, value: "Service" },
    { key: Scope.Region, value: "Region" },
    { key: Scope.LocAuth, value: "Local Authority" }
];

export const REPORT_PARAMS: { key: ReportParams, value: string}[] = [
    { key: ReportParams.Unknown, value: "" },
    { key: ReportParams.PeriodStart, value: "Period Start" },
    { key: ReportParams.PeriodEnd, value: "Period End" },
    { key: ReportParams.TeamCode, value: "Team" },
    { key: ReportParams.RegionId, value: "Region" },
    { key: ReportParams.Frequency, value: "Frequency" },
    { key: ReportParams.RenderType, value: "Output Type" },
    { key: ReportParams.Scope, value: "Scope" },
    { key: ReportParams.LocAuthRef, value: "Local Authority" },
    { key: ReportParams.ServiceId, value: "Service" },
    { key: ReportParams.ShowDetail, value: "Show Detail" },
    { key: ReportParams.Period, value: "Period" }
];
