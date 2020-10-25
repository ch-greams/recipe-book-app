import { SubDirectionType } from "../../../../client/store/recipe/types";
import { NUTRIENTS, NutritionFactType } from "../../../../common/nutritionFacts";
import { Dictionary } from "../../../../common/typings";
import { Units, UnitTemperature, UnitTime } from "../../../../common/units";
import { SchemaValidator, Validator } from "./types";


const nutritionFactProperties = NUTRIENTS.reduce<Dictionary<NutritionFactType, Validator>>(
    (acc, cur) => ({ ...acc, [cur]: { bsonType: "number" } }),
    {},
);

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

const ingredientItemValidator: Validator = {
    bsonType: "object",
    required: [ "id", "name", "nutritionFacts" ],
    properties: {
        id: { bsonType: "string" },
        name: { bsonType: "string" },
        nutritionFacts: {
            bsonType: "object",
            properties: nutritionFactProperties,
        },
    },
};

const ingredientAlternativesValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: [ "item", "amount", "unit" ],
        properties: {
            item: ingredientItemValidator,
            amount: { bsonType: "number" },
            unit: { enum: Object.values(Units) },
        },
    },
};

const ingredientProperties: Dictionary<string, Validator> = {
    item: ingredientItemValidator,
    amount: { bsonType: "number" },
    unit: { enum: Object.values(Units) },
    alternatives: ingredientAlternativesValidator,
};

const ingredientsValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: [ "item", "amount", "unit", "alternatives" ],
        properties: ingredientProperties,
    },
};

const directionStepsValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: [ "type", "label" ],
        properties: {
            type: { enum: Object.values(SubDirectionType) },
            label: { bsonType: "string" },
            id: { bsonType: "string" },
            amount: { bsonType: "number" },
            unit: { enum: Object.values(Units) },
        },
    },
};

const directionProperties: Dictionary<string, Validator> = {
    stepNumber: { bsonType: "number" },
    name: { bsonType: "string" },
    time: {
        bsonType: "object",
        required: [ "count", "unit" ],
        properties: {
            count: { bsonType: "number" },
            unit: { enum: Object.values(UnitTime) },
        },
    },
    temperature: {
        bsonType: "object",
        required: [ "count", "unit" ],
        properties: {
            count: { bsonType: "number" },
            unit: { enum: Object.values(UnitTemperature) },
        },
    },
    steps: directionStepsValidator,
};

const directionsValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: [ "stepNumber", "name", "steps" ],
        properties: directionProperties,
    },
};

const recipeSchema: SchemaValidator= {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "id",
            "name",
            "brand",
            "subtitle",
            "description",
            "type",

            "customUnits",

            "ingredients",
            "directions",
        ],
        properties: {
            id: { bsonType: "string" },
            name: { bsonType: "string" },
            brand: { bsonType: "string" },
            subtitle: { bsonType: "string" },
            description: { bsonType: "string" },
            type: { bsonType: "string" },

            customUnits: customUnitsValidator,

            ingredients: ingredientsValidator,
            directions: directionsValidator,
        },
    },
};

export default recipeSchema;
