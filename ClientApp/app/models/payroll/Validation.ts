import { Adjustment } from "./Adjustment";
import { Carer } from "./Carer";
import { Shift } from "./Shift";

export class ValidationResult {
    public teamCode: number;
    public periodStart: Date;
    public periodFinish: Date;
    public carers: Carer[];
    public pendingAdjustments: Adjustment[];
    public otherAdjustments: Adjustment[];
    public carerDataValidationItems: CarerValidationItem[];
    public invalidShifts: Shift[];
}

export class CarerValidationItem {
    public carer: Carer;
    public revision: string;
}