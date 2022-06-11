


export function unwrapOr<T>(value: Option<T>, defaultValue: T): T {
    return isSome(value) ? value : defaultValue;
}

export function unwrap<T>(value: Option<T>, name: string): T {
    if (isNone(value)) {
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
export function isEnum<EValue, EObject>(enumObject: EObject, value: unknown): value is EValue {
    return Object.values(enumObject).includes(value);
}
