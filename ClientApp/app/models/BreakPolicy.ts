import { BreakDefinition } from "./BreakDefinition";

export class BreakPolicy {
    public id: number;
    public description: string;
    public definitions: BreakDefinition[];
    public validFrom: Date;
    public validTo: Date;
}