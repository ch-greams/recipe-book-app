import { TimeUnit, TemperatureUnit } from "../../../../common/units";


// NOTE: Ingredients

const IngredientAlternativeType = `
    type IngredientAlternative {
        id: String!
        amount: Float!
        unit: Unit!
    }
`;

const IngredientType = `

    ${IngredientAlternativeType}

    type Ingredient {
        id: String!
        amount: Float!
        unit: Unit!
        alternatives: [IngredientAlternative!]!
    }
`;

const IngredientDataType = `
    type IngredientData {
        id: ID!
        name: String!
        brand: String!
        subtitle: String!

        nutritionFacts: NutritionFactValues!
        customUnits: [CustomUnit!]!
    }
`;

// NOTE: Directions

const TimeUnitEnum = `
    enum TimeUnit {
        ${Object.values(TimeUnit).join("\n\t")}
    }
`;

const TimeType = `

    ${TimeUnitEnum}

    type Time {
        count: Float!
        unit: TimeUnit!
    }
`;

const TemperatureUnitEnum = `
    enum TemperatureUnit {
        ${Object.values(TemperatureUnit).join("\n\t")}
    }
`;

const TemperatureType = `

    ${TemperatureUnitEnum}

    type Temperature {
        count: Float!
        unit: TemperatureUnit!
    }
`;

const DirectionStepType = `
    type DirectionStep {
        type: String!
        label: String!
        id: ID
        amount: Float
    }
`;

const DirectionType = `

    ${TimeType}

    ${TemperatureType}

    ${DirectionStepType}

    type Direction {

        stepNumber: Int!
        name: String!

        time: Time
        temperature: Temperature

        steps: [DirectionStep!]!
    }
`;

const ReferencesType = `

    ${IngredientDataType}

    type References {

        food: [IngredientData!]!
        recipe: [IngredientData!]!
    }
`;

const RecipeType = `

    ${IngredientType}

    ${DirectionType}

    ${ReferencesType}

    type Recipe {
        id: ID!
        name: String!
        brand: String!
        subtitle: String!
        description: String!
        type: String!

        customUnits: [CustomUnit!]!

        ingredients: [Ingredient!]!
        directions: [Direction!]!

        references: References!
    }
`;

export default RecipeType;
