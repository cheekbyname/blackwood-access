export class Locale {
    public firstDayOfWeek: number;
    public dayOrder: string[];
    public dayNames: string[];
    public dayNamesShort: string[];
    public dayNamesMin: string[];
    public monthNames: string[];
    public monthNamesShort: string[];
}

export const LOC_EN: Locale = {
    firstDayOfWeek : 1,
    dayOrder: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],   // For timesheet.viewer.component
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo","Tu","We","Th","Fr","Sa"],
    monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}
