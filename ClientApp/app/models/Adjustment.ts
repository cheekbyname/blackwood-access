export class Adjustment {
    public id: number;
	public carerCode: number;
	public weekCommencing: Date;
    public requestedBy: string;
    public requested: Date;
    public authorisedBy: string;
    public authorised: Date;
    public contractCode: number;
    public dayOffset: number;
    public reason: string;
    public hours: number;
    public mins: number;

    constructor(carerCode:number, weekCommencing: Date, dayOffset: number) {
        this.carerCode = carerCode;
        this.weekCommencing = weekCommencing;
        this.dayOffset = dayOffset;
        this.hours = 0;
        this.mins = 0;
    }
}