
export enum Color {
    Default = "#43a047",
    DefaultDark = "#00701a",
    DefaultLight = "#76d275",
    Alternative = "#ff6e40",
    White = "#fff",
}

/**
 * Convert an array or a dictionary of class names into a `string`
 *
 * @param values a list of class names or a dictionary where key is a class name and value is a boolean
 * @returns a joined `string` that will be accepted as value for `className` prop in html elements
 */
export function classNames(values: Dictionary<string, boolean> | string[]): string {
    const classes = Array.isArray(values)
        ? values
        : Object.keys(values).filter((key) => values[key]);

    return classes.join(" ");
}
