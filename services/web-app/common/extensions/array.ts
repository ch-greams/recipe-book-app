

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

Array.prototype.set = function(index, value) {
    this[index] = value;
    return this;
};

Array.prototype.equals = function(value) {
    const thisClone = [ ...this ].sort();
    const otherClone = [ ...value ].sort();
    return thisClone.length === otherClone.length && thisClone.every((element, index) => otherClone[index] === element);
};

Array.prototype.isNotEmpty = function() {
    return this.length > 0;
};

declare global {
    interface Array<T> {
        unique(): T[];
        first(): Option<T>;
        last(): Option<T>;
        set(index: number, value: T): T[];
        equals(value: T[]): boolean;
        isNotEmpty(): boolean;
    }
}

export {};
