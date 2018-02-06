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
    Forwards,
    Backwards
}

export enum Scope {
    Unknown,
    Team,
    Service,
    Region
}

export enum ReportFilters {
    Unknown,
    PeriodStart,
    PeriodEnd,
    TeamCode,
    RegionCode
}

export const FrequencyNames: Map<Frequency, string> = new Map([
    [Frequency.Unknown, "UNKNOWN"],
    [Frequency.Immediate, "Immediate"],
    [Frequency.Hourly, "Hourly"],
    [Frequency.Daily, "Daily"],
    [Frequency.Weekly, "Weekly"],
    [Frequency.Monthly, "Monthly"],
    [Frequency.Quarterly, "Quarterly"]
]);

export const DirectionNames: Map<Direction, string> = new Map([
    [Direction.Unknown, "UNKNOWN"],
    [Direction.Backwards, "Backwards"],
    [Direction.Forwards, "Forwards"]
]);

export const ScopeNames: Map<Scope, string> = new Map([
    [Scope.Unknown, "UNKNOWN"],
    [Scope.Region, "Region"],
    [Scope.Service, "Service"],
    [Scope.Team, "Team"]
]);
