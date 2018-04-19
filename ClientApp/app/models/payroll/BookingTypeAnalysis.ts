export class BookingTypeAnalysis {
    public id: number;
    public analysisCategory: AnalysisCategory;
    public bookingTypeCode: number;
}

export enum AnalysisCategory {
    Unknown,
    AnnualLeave,
    MaternityOtherLeave,
    SicknessAbsence,
    TravelTime,
    Shadowing,
    Supervision,
    TeamMeeting,
    Training,
    ContactTime,
    NonContactTime
}