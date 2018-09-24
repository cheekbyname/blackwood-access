export class PayrollCodeMap {
    public id: number;
    public type: number;
    public typeCode: number;
    public code: string;
    public unit: boolean;
    public payHours: boolean;
    public payInstance: boolean;
    public shiftCode: boolean;
    public payGaps: boolean;
    public active: boolean;
    public toil: ToilSetting;

    constructor(type, code) {
        this.type = type;
        this.typeCode = code;
        this.code = '';
        this.payHours = true;
        this.payInstance = false;
        this.shiftCode = false;
        this.payGaps = false;
        this.active = true;
    }
}

export enum ToilSetting {
    NotApplicable = 0,
    Increment = 1,
    Decrement = 2
}

export const TOIL:  { key: ToilSetting, value: string } [] = [
    { key: ToilSetting.NotApplicable, value: "Not Applicable" },
    { key: ToilSetting.Increment, value: "Add Toil" },
    { key: ToilSetting.Decrement, value: "Subtract Toil" }
];