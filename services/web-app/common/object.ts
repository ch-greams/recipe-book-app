import { isSome } from "./types";



export function getKeys<T extends object>(obj: T | Dictionary<keyof T, unknown>, ensureNumber: boolean = false): (keyof T)[] {
    return ( ensureNumber ? Object.keys(obj).map(Number) : Object.keys(obj) ) as (keyof T)[];
}

export function getValues<T>(obj: Dictionary<ID, T>): T[] {
    return Object.values(obj) as T[];
}

export function objectIsNotEmpty<T>(obj: T | Dictionary<string | number | symbol, T>): boolean {
    return (!!obj && (typeof obj === "object") && Object.keys(obj).length > 0);
}

/**
 * Calls a defined callback function on each `key-value` pair of a `Record`, and returns a `Record` that contains the results.
 * This "wrapper" function allows you to safely keep using same record type without forced assignment or errors.
 *
 * @param record - Provided initial `Record` value.
 * @param callback - A function that accepts up two arguments. The map method calls the callback function one time for each `key-value` pair of a `Record`.
 */
export function mapRecord<K extends string | number, V, RV>(record: Record<K, V>, callback: (key: K, value: V) => RV): Record<K, RV> {
    return getKeys(record).reduce((acc, cur) => ({ ...acc, [cur]: callback(cur, record[cur]) }), {}) as Record<K, RV>;
}

/**
 * Calls a defined callback function on each `key-value` pair of a `Record`, and returns a `Record` that contains the results.
 * This "wrapper" function allows you to safely keep using same record type without forced assignment or errors.
 *
 * @param record - Provided initial `Record` value.
 * @param callback - A function that accepts up two arguments. The map method calls the callback function one time for each `key-value` pair of a `Record`.
 */
export function mapDictionary<K extends string | number, V, RV>(record: Dictionary<K, V>, callback: (key: K, value: V) => RV): Dictionary<K, RV> {
    return getKeys(record)
        .reduce((acc, cur) => {
            const item: Option<V> = record[cur];
            return { ...acc, [cur]: isSome(item) ? callback(cur, item) : item };
        }, {});
}
