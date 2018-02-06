import { FilterOption } from "./FilterOption";

export class Report {
    public id: number;
    public name: string;
    public resourceName: string;
    public dataSourceName: string;

    public filterOptions: FilterOption[];
}