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

export enum ReportFilters {
    Unknown,
    PeriodStart,
    PeriodEnd,
    TeamCode,
    RegionCode
}

export const FrequencyNames: { key: Frequency, value: string }[] = [
    { key: Frequency.Unknown, value: "" },
    { key: Frequency.Immediate, value: "Immediate" },
    { key: Frequency.Hourly, value: "Hourly" },
    { key: Frequency.Daily, value: "Daily" },
    { key: Frequency.Weekly, value: "Weekly" },
    { key: Frequency.Monthly, value: "Monthly" },
    { key: Frequency.Quarterly, value: "Quarterly" }
];

export const DirectionNames: { key: Direction, value: string }[] = [
    { key: Direction.Unknown,  value: "" },
    { key: Direction.Current, value: "Current" },
    { key: Direction.Previous, value: "Previous" },
    { key: Direction.Next, value: "Next" }
];

export const ScopeNames: { key: Scope, value: string }[] = [
    { key: Scope.Unknown, value: "" },
    { key: Scope.Team, value: "Team" },
    { key: Scope.Service, value: "Service" },
    { key: Scope.Region, value: "Region" },
    { key: Scope.LocAuth, value: "Local Authority" }
];
