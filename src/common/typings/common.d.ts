
export type None = null | undefined;
export type Some<T> = T;
export type Option<T> = None | Some<T>;


export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]?: TValue;
};

export type InputChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type SelectChangeCallback = (event: React.ChangeEvent<HTMLSelectElement>) => void;
