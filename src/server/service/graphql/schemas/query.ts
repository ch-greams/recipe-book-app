import { NutritionFactType } from "@common/nutritionFacts";
import { Units } from "@common/units";

import FoodType from "./food";
import RecipeType from "./recipe";



const UnitEnum = `
    enum Unit {
        ${Object.values(Units).join("\n\t")}
    }
`;

const CustomUnitType = `
    type CustomUnit {
        name: String!
        amount: Float!
        unit: Unit!
    }
`;

const NutritionFactValuesType = `
    type NutritionFactValues {
        ${Object.values(NutritionFactType).map((type) => `${type}: Float`).join("\n\t")}
    }
`;


const QueryType = `

    ${UnitEnum}

    ${CustomUnitType}

    ${NutritionFactValuesType}

    ${FoodType}

    ${RecipeType}

    type Query {

        foods(limit: Int): [Food!]!
        food(id: ID!): Food!

        recipes(limit: Int): [Recipe!]!
        recipe(id: ID!): Recipe!
    }
`;

export default QueryType;
