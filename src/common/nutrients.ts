import { UnitEnergy, UnitWeight } from "./units";



export enum NutritionFactType {

    Energy = "Energy",
    CarbohydrateEnergy = "Carbohydrate Energy",
    FatEnergy = "Fat Energy",
    ProteinEnergy = "Protein Energy",

    // Carbohydrates
    Carbohydrate = "Carbohydrate",
    DietaryFiber = "Dietary Fiber",
    Starch = "Starch",
    Sugars = "Sugars",

    // Lipids
    Fat = "Fat",
    Monounsaturated = "Monounsaturated",
    Polyunsaturated = "Polyunsaturated",
    Omega3 = "Omega-3",
    Omega6 = "Omega-6",
    Saturated = "Saturated",
    TransFats = "Trans-Fats",
    Cholesterol = "Cholesterol",
    Phytosterol = "Phytosterol",

    // Proteins & Amino Acids
    Protein = "Protein",
    Tryptophan = "Tryptophan",
    Threonine = "Threonine",
    Isoleucine = "Isoleucine",
    Leucine = "Leucine",
    Lysine = "Lysine",
    Methionine = "Methionine",
    Cystine = "Cystine",
    Phenylalanine = "Phenylalanine",
    Tyrosine = "Tyrosine",
    Valine = "Valine",
    Arginine = "Arginine",
    Histidine = "Histidine",
    Alanine = "Alanine",
    AsparticAcid = "Aspartic Acid",
    GlutamicAcid = "Glutamic Acid",
    Glycine = "Glycine",
    Proline = "Proline",
    Serine = "Serine",
    Hydroxyproline = "Hydroxyproline",

    // Vitamins
    VitaminA = "Vitamin A",
    VitaminC = "Vitamin C",
    VitaminD = "Vitamin D",
    VitaminE = "Vitamin E",
    VitaminK = "Vitamin K",
    VitaminB1 = "B1 - Thiamin",
    VitaminB2 = "B2 - Riboflavin",
    VitaminB3 = "B3 - Niacin",
    VitaminB5 = "B5 - Pantothenic Acid",
    VitaminB6 = "B6 - Pyridoxine",
    VitaminB9 = "B9 - Folate",
    VitaminB12 = "B12 - Cobalamin",
    Choline = "Choline",
    Betaine = "Betaine",

    // Minerals
    Calcium = "Calcium",
    Iron = "Iron",
    Magnesium = "Magnesium",
    Phosphorus = "Phosphorus",
    Potassium = "Potassium",
    Sodium = "Sodium",
    Zinc = "Zinc",
    Copper = "Copper",
    Manganese = "Manganese",
    Selenium = "Selenium",
    Fluoride = "Fluoride",
    Chromium = "Chromium",
    Iodine = "Iodine",
    Molybdenum = "Molybdenum",

    // Other
    Alcohol = "Alcohol",
    Water = "Water",
    Ash = "Ash",
    Caffeine = "Caffeine",
}


export const CARBOHYDRATES_GROUP: NutritionFactType[] = [

    NutritionFactType.Carbohydrate,
    NutritionFactType.DietaryFiber,
    NutritionFactType.Starch,
    NutritionFactType.Sugars,
];

export const LIPIDS_GROUP: NutritionFactType[] = [

    NutritionFactType.Fat,
    NutritionFactType.Monounsaturated,
    NutritionFactType.Polyunsaturated,
    NutritionFactType.Omega3,
    NutritionFactType.Omega6,
    NutritionFactType.Saturated,
    NutritionFactType.TransFats,
    NutritionFactType.Cholesterol,
];

export const PROTEINS_GROUP: NutritionFactType[] = [

    NutritionFactType.Protein,
    NutritionFactType.Tryptophan,
    NutritionFactType.Threonine,
    NutritionFactType.Isoleucine,
    NutritionFactType.Leucine,
    NutritionFactType.Lysine,
    NutritionFactType.Methionine,
    NutritionFactType.Cystine,
    NutritionFactType.Phenylalanine,
    NutritionFactType.Tyrosine,
    NutritionFactType.Valine,
    NutritionFactType.Arginine,
    NutritionFactType.Histidine,
    NutritionFactType.Alanine,
    NutritionFactType.AsparticAcid,
    NutritionFactType.GlutamicAcid,
    NutritionFactType.Glycine,
    NutritionFactType.Proline,
    NutritionFactType.Serine,
    NutritionFactType.Hydroxyproline,
];

export const VITAMINS_GROUP: NutritionFactType[] = [

    NutritionFactType.VitaminA,
    NutritionFactType.VitaminC,
    NutritionFactType.VitaminD,
    NutritionFactType.VitaminE,
    NutritionFactType.VitaminK,
    NutritionFactType.VitaminB1,
    NutritionFactType.VitaminB2,
    NutritionFactType.VitaminB3,
    NutritionFactType.VitaminB5,
    NutritionFactType.VitaminB6,
    NutritionFactType.VitaminB9,
    NutritionFactType.VitaminB12,
    NutritionFactType.Choline,
    NutritionFactType.Betaine,
];

export const MINERALS_GROUP: NutritionFactType[] = [

    NutritionFactType.Calcium,
    NutritionFactType.Iron,
    NutritionFactType.Magnesium,
    NutritionFactType.Phosphorus,
    NutritionFactType.Potassium,
    NutritionFactType.Sodium,
    NutritionFactType.Zinc,
    NutritionFactType.Copper,
    NutritionFactType.Manganese,
    NutritionFactType.Selenium,
    NutritionFactType.Fluoride,
    NutritionFactType.Chromium,
    NutritionFactType.Iodine,
    NutritionFactType.Molybdenum,
];

export const OTHER_GROUP: NutritionFactType[] = [

    NutritionFactType.Alcohol,
    NutritionFactType.Water,
    NutritionFactType.Ash,
    NutritionFactType.Caffeine,
];


export enum NutrientGroupType {

    Carbohydrates = "Carbohydrates",
    Lipids = "Lipids",
    Proteins = "Proteins & Amino Acids",
    Vitamins = "Vitamins",
    Minerals = "Minerals",
    Other = "Other",
}

export const NUTRIENTS: NutritionFactType[] = [

    ...CARBOHYDRATES_GROUP,
    ...LIPIDS_GROUP,
    ...PROTEINS_GROUP,
    ...VITAMINS_GROUP,
    ...MINERALS_GROUP,
    ...OTHER_GROUP,
];


export interface NutritionFactDescription {
    type: NutritionFactType;
    unit: UnitWeight | UnitEnergy;
    dailyValue?: number;
    isFraction: boolean;
}
