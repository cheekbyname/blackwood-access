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