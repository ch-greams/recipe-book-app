import { format, parse } from "date-fns";



const DEFAULT_TIME_FORMAT: string = "HH:mm:ss";
const DEFAULT_TIME_DISPLAY_FORMAT: string = "HH:mm";

const DEFAULT_DATE_FORMAT: string = "yyyy-MM-dd";
const DEFAULT_DATE_DISPLAY_FORMAT: string = "PPP";


/**
 * Parse provided time string and return it in the default format to display
 *
 * @param time should adhere to `DEFAULT_TIME_FORMAT`
 * @returns time in `DEFAULT_TIME_DISPLAY_FORMAT`
 */
export function formatTime(time: string): string {
    return format(parse(time, DEFAULT_TIME_FORMAT, new Date()), DEFAULT_TIME_DISPLAY_FORMAT);
}


/**
 * Parse provided date string and return it in the default format to display
 *
 * @param date should adhere to `DEFAULT_DATE_FORMAT`
 * @returns date in `DEFAULT_DATE_DISPLAY_FORMAT`
 */
export function formatDate(date: string): string {
    return format(parse(date, DEFAULT_DATE_FORMAT, new Date()), DEFAULT_DATE_DISPLAY_FORMAT);
}
