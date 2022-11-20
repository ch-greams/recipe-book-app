

export function decimalNormalizer(value: string, previousValue: string): string {

    const DEFAULT_VALUE = "";

    if (value) {
        const isDouble = /^\d*\.?\d+$/.test(value);
        const isPartialDecimal = /^\d*\.?$/.test(value);

        const isValid = isDouble || isPartialDecimal;

        return ( isValid ? value : (previousValue || DEFAULT_VALUE) );
    }

    return DEFAULT_VALUE;
}

export function timeNormalizer(value: string, previousValue: string): string {

    const DEFAULT_VALUE = "";

    return value || previousValue || DEFAULT_VALUE;
}
