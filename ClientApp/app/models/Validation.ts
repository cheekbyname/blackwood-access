import { Adjustment } from "./adjustment";
import { Carer } from "./carer";

export class ValidationResult {
    public teamCode: number;
    public periodStart: Date;
    public periodFinish: Date;
    public carers: Carer[];
    public pendingAdjustments: Adjustment[];
    public carerValidationItems: CarerValidationItem[];
}

export class CarerValidationItem {
    public carer: Carer;
    public revision: string;
}