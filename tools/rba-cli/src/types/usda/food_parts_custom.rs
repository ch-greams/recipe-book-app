use serde::{Deserialize, Serialize};

//------------------------------------------------------------------------------
// Custom types (not directly taken from USDA spec)
//------------------------------------------------------------------------------

#[derive(Serialize, Deserialize, Debug)]
pub struct FoodAttributeType {
    pub id: i32,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LabelNutrient {
    pub value: f32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LabelNutrients {
    pub fat: Option<LabelNutrient>,
    pub saturated_fat: Option<LabelNutrient>,
    pub trans_fat: Option<LabelNutrient>,
    pub cholesterol: Option<LabelNutrient>,
    pub sodium: Option<LabelNutrient>,
    pub carbohydrates: Option<LabelNutrient>,
    pub fiber: Option<LabelNutrient>,
    pub sugars: Option<LabelNutrient>,
    pub protein: Option<LabelNutrient>,
    pub calcium: Option<LabelNutrient>,
    pub iron: Option<LabelNutrient>,
    pub potassium: Option<LabelNutrient>,
    pub calories: Option<LabelNutrient>,
}
