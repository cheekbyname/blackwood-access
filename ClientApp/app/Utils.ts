export module Utils {

    export function SqlDate(date: Date): string {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + date.getDate();
    }

    export function FormatDate(dt) {
        return new Date(dt).toLocaleDateString("en-GB");
    }

    export function FormatTime(dt) {
        return new Date(dt).toLocaleTimeString("en-GB");
    }

    export function DisplayTime(mins: number): string {
        if (mins < 0) {
            return Math.ceil(mins / 60) + "h " + (mins % 60) + "m";
        }
        return Math.floor(mins / 60) + "h " + (mins % 60) + "m";
    }

    export function AdjustDateByDays(adjDate: Date, offset: number): Date {
		let dt: Date = new Date(adjDate);
		dt.setDate(dt.getDate() + offset);
		return dt;
    }
    
    export function AdjustDateByMonths(adjDate: Date, offset: number): Date {
        let dt: Date = new Date(adjDate);
        dt.setMonth(dt.getMonth() + offset);
        return dt;
    }
}