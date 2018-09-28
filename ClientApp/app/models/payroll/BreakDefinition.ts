import { BreakPolicy } from "./BreakPolicy";

export class BreakDefinition {
    public id: number;
    public breakPolicyId: number;
    public minThreshold: number;
    public maxThreshold: number;
    public breakLength: number;
    public paid: boolean;
    public validFrom: Date;
    public ValidTo: Date;

    public breakPolicy: BreakPolicy;
}