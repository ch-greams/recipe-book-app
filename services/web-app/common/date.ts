import { addDays, format, parse } from "date-fns";



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

/**
 * Get current time in `DEFAULT_TIME_FORMAT` format
 *
 * @returns time in `DEFAULT_TIME_FORMAT`
 */
export function getCurrentTime(): string {
    return format(new Date(), DEFAULT_TIME_FORMAT);
}

/**
 * Get current time in `DEFAULT_DATE_FORMAT` format
 *
 * @returns time in `DEFAULT_DATE_FORMAT`
 */
export function getCurrentDate(): string {
    return format(new Date(), DEFAULT_DATE_FORMAT);
}

/**
 * Adds provided number of days and returns formatted date string
 *
 * @param date should adhere to `DEFAULT_DATE_FORMAT`
 * @param days can only accept signed integers as a number of days
 * @returns changed date in `DEFAULT_DATE_FORMAT`
 */
export function changeDate(date: string, days: number): string {
    const parsedDate = parse(date, DEFAULT_DATE_FORMAT, new Date());
    return format(addDays(parsedDate, days), DEFAULT_DATE_FORMAT);
}
