import { Incident } from "./Incident";
import { Type } from "./Type";

export class Category {
    public id: number;
    public description: string;

    public incidents: Incident[];
    public types: Type[];
}