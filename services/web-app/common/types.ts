import Logger from "@common/logger";

export function unwrapOr<T>(value: Option<T>, defaultValue: T): T {
    return isSome(value) ? value : defaultValue;
}

/**
 * Unwrap an optional value and return it without `Option` wrapper
 *
 * @throws      `Error` containing the name of the variable that couldn't be unwrapped
 * @param value variable with optional value to unwrap
 * @param name  will be used to variable in an exception
 * @returns     value without option wrapper type
 */
export function unwrap<T>(value: Option<T>, name: string): T {
    if (isNone(value)) {
        Logger.error(`unwrap [${name}]`);
        throw new Error(`Error: Unexpectedly found None while unwrapping an Option value [${name}]`);
    }

    return value;
}

export function isSome<T>(value: Option<T>): value is T {
    return (value !== null) && (value !== undefined);
}

export function isNone<T>(value: Option<T>): value is None {
    return (value === null) || (value === undefined);
}

/**
 * Confirms is the value belongs to the provided enum
 */
export function isEnum<EValue, EObject extends object>(enumObject: EObject, value: unknown): value is EValue {
    return Object.values(enumObject).includes(value);
}
