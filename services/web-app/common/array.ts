import type { Comparer } from "./typings";



export enum ComparerResult {
    Negative = -1,
    Zero = 0,
    Positive = 1,
}

export function sortBy<T>(field: keyof T): Comparer<T> {
    return (a: T, b: T) => (
        a[field] > b[field] ? ComparerResult.Positive : ComparerResult.Negative
    );
}

export function sortByConverted<T, V>(field: keyof T, converter: (value: T[keyof T]) => V): Comparer<T> {
    return (a: T, b: T) => (
        converter(a[field]) > converter(b[field]) ? ComparerResult.Positive : ComparerResult.Negative
    );
}
