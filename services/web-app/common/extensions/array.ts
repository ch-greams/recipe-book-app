

Array.prototype.unique = function() {
    return [ ...new Set(this) ];
};

Array.prototype.first = function() {
    return this[0];
};

Array.prototype.last = function() {
    const LAST_INDEX = -1;
    return this.at(LAST_INDEX);
};

declare global {
    interface Array<T> {
        unique(): T[];
        first(): Option<T>;
        last(): Option<T>;
    }
}

export {};
