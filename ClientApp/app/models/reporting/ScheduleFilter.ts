import { Schedule } from "./Schedule";
import { FilterOption } from "./FilterOption";

export class ScheduleFilter {
    public id: number;
    public scheduleId: number;
    public filterOptionId: number;
    public value: number;

    public schedule: Schedule;
    public filterOption: FilterOption;
}