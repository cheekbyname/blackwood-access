import { Category } from "./Category";
import { Incident } from "./Incident";

export class Type {
    public id: number;
    public desc: string;
    public incidentCategoryId: number;
    public isActive: boolean;

    public category: Category;
    
    public incidents: Incident[];
}