

String.prototype.isNotEmpty = function() {
    return this.trim().length > 0;
};

String.prototype.numberOfLines = function() {
    return (this.match(/\n/g) || "").length + 1;
};

String.prototype.toNumber = function() {
    return this.isNotEmpty() ? Number(this) : null;
};

declare global {
    interface String {
        isNotEmpty(): boolean;
        numberOfLines(): number;
        /**
         * @returns converted `number` or `null` if `value` was an empty `string`
         */
        toNumber(): Option<number>;
    }
}

export {};
