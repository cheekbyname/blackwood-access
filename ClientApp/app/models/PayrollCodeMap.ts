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

    constructor(type, code) {
        this.type = type;
        this.typeCode = code;
    }
}