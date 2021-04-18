import { NUTRIENTS, NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import { Units } from "@common/units";

import { SchemaValidator, Validator } from "./types";



const nutritionFactProperties = NUTRIENTS.reduce<Dictionary<NutritionFactType, Validator>>(
    (acc, cur) => ({ ...acc, [cur]: { bsonType: "number" } }),
    {},
);

const nutritionFactValuesValidator: Validator = {
    bsonType: "object",
    properties: nutritionFactProperties,
};

const customUnitProperties: Dictionary<string, Validator> = {
    name: { bsonType: "string" },
    amount: { bsonType: "number" },
    unit: { enum: Object.values(Units) },
};

const customUnitsValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: Object.keys(customUnitProperties),
        properties: customUnitProperties,
    },
};

const foodSchema: SchemaValidator = {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "id",
            "name",
            "brand",
            "subtitle",
            "nutritionFacts",
            "customUnits",
        ],
        properties: {
            id: { bsonType: "string" },
            name: { bsonType: "string" },
            brand: { bsonType: "string" },
            subtitle: { bsonType: "string" },
            nutritionFacts: nutritionFactValuesValidator,
            customUnits: customUnitsValidator,
        },
    },
};

export default foodSchema;
