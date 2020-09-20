import { UnitWeight } from "./units";


export interface Nutrient {
    type: NutrientType;
    amount: number;
    unit: UnitWeight;
    dv: number;
    isFraction: boolean;
}

export enum NutrientType {

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
    VitaminB1 = "Vitamin B1 / Thiamin",
    VitaminB2 = "Vitamin B2 / Riboflavin",
    VitaminB3 = "Vitamin B3 / Niacin",
    VitaminB5 = "Vitamin B5 / Pantothenic Acid",
    VitaminB6 = "Vitamin B6 / Pyridoxine",
    VitaminB9 = "Vitamin B9 / Folate",
    VitaminB12 = "Vitamin B12 / Cobalamin",
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


export const CARBOHYDRATES: NutrientType[] = [

    NutrientType.Carbohydrate,
    NutrientType.DietaryFiber,
    NutrientType.Starch,
    NutrientType.Sugars,
];

export const LIPIDS: NutrientType[] = [

    NutrientType.Fat,
    NutrientType.Monounsaturated,
    NutrientType.Polyunsaturated,
    NutrientType.Omega3,
    NutrientType.Omega6,
    NutrientType.Saturated,
    NutrientType.TransFats,
    NutrientType.Cholesterol,
];

export const PROTEINS: NutrientType[] = [

    NutrientType.Protein,
    NutrientType.Tryptophan,
    NutrientType.Threonine,
    NutrientType.Isoleucine,
    NutrientType.Leucine,
    NutrientType.Lysine,
    NutrientType.Methionine,
    NutrientType.Cystine,
    NutrientType.Phenylalanine,
    NutrientType.Tyrosine,
    NutrientType.Valine,
    NutrientType.Arginine,
    NutrientType.Histidine,
    NutrientType.Alanine,
    NutrientType.AsparticAcid,
    NutrientType.GlutamicAcid,
    NutrientType.Glycine,
    NutrientType.Proline,
    NutrientType.Serine,
    NutrientType.Hydroxyproline,
];

export const VITAMINS: NutrientType[] = [

    NutrientType.VitaminA,
    NutrientType.VitaminC,
    NutrientType.VitaminD,
    NutrientType.VitaminE,
    NutrientType.VitaminK,
    NutrientType.VitaminB1,
    NutrientType.VitaminB2,
    NutrientType.VitaminB3,
    NutrientType.VitaminB5,
    NutrientType.VitaminB6,
    NutrientType.VitaminB9,
    NutrientType.VitaminB12,
    NutrientType.Choline,
    NutrientType.Betaine,
];

export const MINERALS: NutrientType[] = [

    NutrientType.Calcium,
    NutrientType.Iron,
    NutrientType.Magnesium,
    NutrientType.Phosphorus,
    NutrientType.Potassium,
    NutrientType.Sodium,
    NutrientType.Zinc,
    NutrientType.Copper,
    NutrientType.Manganese,
    NutrientType.Selenium,
    NutrientType.Fluoride,
    NutrientType.Chromium,
    NutrientType.Iodine,
    NutrientType.Molybdenum,
];

export const OTHER: NutrientType[] = [

    NutrientType.Alcohol,
    NutrientType.Water,
    NutrientType.Ash,
    NutrientType.Caffeine,
];


export enum NutrientGroupType {

    Carbohydrates = "Carbohydrates",
    Lipids = "Lipids",
    Proteins = "Proteins & Amino Acids",
    Vitamins = "Vitamins",
    Minerals = "Minerals",
    Other = "Other",
}

export const NUTRIENTS: NutrientType[] = [

    ...CARBOHYDRATES,
    ...LIPIDS,
    ...PROTEINS,
    ...VITAMINS,
    ...MINERALS,
    ...OTHER,
];
