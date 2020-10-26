import { UnitTime, UnitTemperature } from "../../../../common/units";


// NOTE: Ingredients

const IngredientItemType = `
    type IngredientItem {
        id: ID!
        name: String!
        nutritionFacts: NutritionFactValues!
    }
`;

const IngredientAlternativeType = `
    type IngredientAlternative {

        item: IngredientItem!

        amount: Float!
        unit: Unit!
    }
`;

const IngredientType = `

    ${IngredientItemType}

    ${IngredientAlternativeType}

    type Ingredient {

        item: IngredientItem!

        amount: Float!
        unit: Unit!
        alternatives: [IngredientAlternative!]!
    }
`;

// NOTE: Directions

const UnitTimeEnum = `
    enum UnitTime {
        ${Object.values(UnitTime).join("\n\t")}
    }
`;

const TimeType = `

    ${UnitTimeEnum}

    type Time {
        count: Float!
        unit: UnitTime!
    }
`;

const UnitTemperatureEnum = `
    enum UnitTemperature {
        ${Object.values(UnitTemperature).join("\n\t")}
    }
`;

const TemperatureType = `

    ${UnitTemperatureEnum}

    type Temperature {
        count: Float!
        unit: UnitTemperature!
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

const RecipeType = `

    ${IngredientType}

    ${DirectionType}

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
    }
`;

export default RecipeType;
