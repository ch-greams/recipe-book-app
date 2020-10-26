
const FoodType = `
    type Food {
        id: ID!
        name: String!
        brand: String!
        subtitle: String!

        nutritionFactValues: NutritionFactValues!
        customUnits: [CustomUnit!]!
    }
`;

export default FoodType;
