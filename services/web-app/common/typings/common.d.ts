
export type InputChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type OnClickCallback = (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

export type Comparer<T> = (a: T, b: T) => ComparerResult;
