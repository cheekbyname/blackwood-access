export class Locale {
    public firstDayOfWeek: number;
    public dayNames: string[];
    public dayNamesShort: string[];
    public dayNamesMin: string[];
    public monthNames: string[];
    public monthNamesShort: string[];
}

export const LOC_EN: Locale = {
    firstDayOfWeek : 0,
    dayNames: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    dayNamesShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    dayNamesMin: ["Mo","Tu","We","Th","Fr","Sa", "Su"],
    monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}
