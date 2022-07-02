import Utils from "../utils";


Array.prototype.unique = function() {
    return [ ...new Set(this) ];
};

Array.prototype.first = function() {
    return this[Utils.ZERO];
};


declare global {
    interface Array<T> {
        unique(): T[];
        first(): Option<T>;
    }
}

export {};
