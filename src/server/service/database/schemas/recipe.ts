import { SubDirectionType } from "@client/store/recipe/types";
import type { Dictionary } from "@common/typings";
import { Units, TemperatureUnit, TimeUnit } from "@common/units";
import { SchemaValidator, Validator } from "./types";


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

const ingredientAlternativesValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: [ "id", "amount", "unit" ],
        properties: {
            id: { bsonType: "string" },
            amount: { bsonType: "number" },
            unit: { enum: Object.values(Units) },
        },
    },
};

const ingredientProperties: Dictionary<string, Validator> = {
    id: { bsonType: "string" },
    amount: { bsonType: "number" },
    unit: { enum: Object.values(Units) },
    alternatives: ingredientAlternativesValidator,
};

const ingredientsValidator: Validator = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: [ "id", "amount", "unit", "alternatives" ],
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
            unit: { enum: Object.values(TimeUnit) },
        },
    },
    temperature: {
        bsonType: "object",
        required: [ "count", "unit" ],
        properties: {
            count: { bsonType: "number" },
            unit: { enum: Object.values(TemperatureUnit) },
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

const referencesValidator: Validator = {
    bsonType: "object",
    required: [ "food", "recipe" ],
    properties: {
        food: {
            bsonType: "array",
            items: { bsonType: "string" },
        },
        recipe: {
            bsonType: "array",
            items: { bsonType: "string" },
        },
    },
};

const recipeSchema: SchemaValidator = {
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

            "references",
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

            references: referencesValidator,
        },
    },
};

export default recipeSchema;
