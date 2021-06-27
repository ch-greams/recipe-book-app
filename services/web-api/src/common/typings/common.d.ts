
export type None = null | undefined;
export type Some<T> = T;
export type Option<T> = None | Some<T>;


export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]?: TValue;
};
