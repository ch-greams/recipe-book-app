/* eslint-disable max-len */
import { Dictionary } from "../../../../common/typings";


type integer = number;
type regex = string;
type Validator = ValidatorNumber | ValidatorString | ValidatorObject | ValidatorArray;
type SchemaValidator = { $jsonSchema: Validator };

/**
 * @interface ValidatorBase
 * 
 * All Types
 * 
 * @prop {string | string[]} [bsonType] - Accepts same string aliases used for the $type operator
 * @prop {(string | number)[]} [enum]   - Enumerates all possible values of the field
 * @prop {string | string[]} [type]     - Enumerates the possible JSON types of the field.
 *                                        Available types are “object”, “array”, “number”, “boolean”, “string”, and “null”.
 *                                        MongoDB’s implementation of the JSON Schema does not support the “integer” type.
 *                                        Use the bsonType keyword and the “int” or “long” types instead.
 * @prop {Validator[]} [allOf]         - Field must match all specified schemas
 * @prop {Validator[]} [anyOf]         - Field must match at least one of the specified schemas
 * @prop {Validator[]} [oneOf]         - Field must match exactly one of the specified schemas
 * @prop {Validator} [not]             - Field must not match the schema
 * 
 * N/A
 * 
 * @prop {string} [title]               - A descriptive title string with no effect.
 * @prop {string} [description]         - A string that describes the schema and has no effect.
 */
interface ValidatorBase {
    bsonType?: string | string[];
    enum?: (string | number)[];
    type?: string | string[];
    allOf?: Validator[];
    anyOf?: Validator[];
    oneOf?: Validator[];
    not?: Validator;
    title?: string;
    description?: string;
}

/**
 * @interface ValidatorNumber
 * @extends ValidatorBase
 * 
 * @prop {number} [multipleOf]          - Field must be a multiple of this value
 * @prop {number} [maximum]             - Indicates the maximum value of the field
 * @prop {boolean} [exclusiveMaximum]   - If true and field is a number, maximum is an exclusive maximum. Otherwise, it is an inclusive maximum.
 * @prop {number} [minimum]             - Indicates the minimum value of the field
 * @prop {boolean} [exclusiveMinimum]   - If true, minimum is an exclusive minimum. Otherwise, it is an inclusive minimum.
 */
interface ValidatorNumber extends ValidatorBase {
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
}

/**
 * @interface ValidatorString
 * @extends ValidatorBase
 * 
 * @prop {integer} [maxLength]  - Indicates the maximum length of the field
 * @prop {integer} [minLength]  - Indicates the minimum length of the field
 * @prop {regex} [pattern]      - Field must match the regular expression
 */
interface ValidatorString extends ValidatorBase {
    maxLength?: integer;
    minLength?: integer;
    pattern?: regex;
}

/**
 * @interface ValidatorObject
 * @extends ValidatorBase
 * 
 * @prop {integer} [maxProperties]                      - Indicates the field’s maximum number of properties
 * @prop {integer} [minProperties]                      - Indicates the field’s minimum number of properties
 * @prop {string | string[]} [required]                 - Object’s property set must contain all the specified elements in the array
 * @prop {boolean | Dictionary<string, Validator>} [additionalProperties]   - If true, additional fields are allowed. If false, they are not.
 *                                                                            If a valid JSON Schema object is specified, additional fields must validate against the schema.
 *                                                                            Defaults to true.
 * @prop {Dictionary<string, Validator>} [properties]               - A valid JSON Schema where each value is also a valid JSON Schema object
 * @prop {Dictionary<regex, Validator>} [patternProperties]         - In addition to properties requirements, each property name of this object must be a valid regular expression
 * @prop {Dictionary<string, string[] | Validator>} [dependencies]  - Describes field or schema dependencies
 */
interface ValidatorObject extends ValidatorBase {
    maxProperties?: integer;
    minProperties?: integer;
    required?: string | string[];
    additionalProperties?: boolean | Dictionary<string, Validator>;
    properties?: Dictionary<string, Validator>;
    patternProperties?: Dictionary<regex, Validator>;
    dependencies?: Dictionary<string, string[] | Validator>;
}

/**
 * @interface ValidatorArray
 * @extends ValidatorBase
 * 
 * @prop {boolean | Validator} [additionalItems]    - If an object, must be a valid JSON Schema
 * @prop {Validator | Validator[]} [items]          - Must be either a valid JSON Schema, or an array of valid JSON Schemas
 * @prop {integer} [maxItems]                       - Indicates the maximum length of array
 * @prop {integer} [minItems]                       - Indicates the minimum length of array
 * @prop {boolean} [uniqueItems]                    - If true, each item in the array must be unique.
 *                                                    Otherwise, no uniqueness constraint is enforced.
 */
interface ValidatorArray extends ValidatorBase {
    additionalItems?: boolean | Validator;
    items?: Validator | Validator[];
    maxItems?: integer;
    minItems?: integer;
    uniqueItems?: boolean;
}
