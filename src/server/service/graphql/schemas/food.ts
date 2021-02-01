
const FoodType = `
    type Food {
        id: ID!
        name: String!
        brand: String!
        subtitle: String!

        nutritionFacts: NutritionFactValues!
        customUnits: [CustomUnit!]!
    }
`;

export default FoodType;
