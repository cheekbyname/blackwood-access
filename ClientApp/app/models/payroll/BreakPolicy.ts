import { BreakDefinition } from "./BreakDefinition";

export class BreakPolicy {
    public id: number;
    public description: string;
    public validFrom: Date;
    public validTo: Date;

    public definitions: BreakDefinition[];
}
