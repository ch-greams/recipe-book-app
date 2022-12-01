import { addDays, format, parse } from "date-fns";



export const DEFAULT_TIME_FORMAT: string = "HH:mm:ss";
export const DEFAULT_TIME_DISPLAY_FORMAT: string = "HH:mm";

export const DEFAULT_DATE_FORMAT: string = "yyyy-MM-dd";
export const DEFAULT_DATE_DISPLAY_FORMAT: string = "PPP";


/**
 * Parse provided time string and return it in the default format to display
 *
 * @param time should adhere to provided fromFormat or `DEFAULT_TIME_FORMAT` by default
 * @returns time in toFormat or `DEFAULT_TIME_DISPLAY_FORMAT` by default
 */
export function formatTime(
    time: string,
    fromFormat: string = DEFAULT_TIME_FORMAT,
    toFormat: string = DEFAULT_TIME_DISPLAY_FORMAT,
): string {
    return format(parse(time, fromFormat, new Date()), toFormat);
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
 * Get current time in provided format (by default it's `DEFAULT_TIME_DISPLAY_FORMAT`)
 *
 * @returns formatted time
 */
export function getCurrentTime(timeFormat: string = DEFAULT_TIME_DISPLAY_FORMAT): string {
    return format(new Date(), timeFormat);
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

export function parseTime(time: string): Date {
    return parse(time, DEFAULT_TIME_DISPLAY_FORMAT, new Date());
}
