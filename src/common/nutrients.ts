import { Dictionary } from "./typings";
import { UnitWeight } from "./units";



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


export const CARBOHYDRATES_GROUP: NutrientType[] = [

    NutrientType.Carbohydrate,
    NutrientType.DietaryFiber,
    NutrientType.Starch,
    NutrientType.Sugars,
];

export const LIPIDS_GROUP: NutrientType[] = [

    NutrientType.Fat,
    NutrientType.Monounsaturated,
    NutrientType.Polyunsaturated,
    NutrientType.Omega3,
    NutrientType.Omega6,
    NutrientType.Saturated,
    NutrientType.TransFats,
    NutrientType.Cholesterol,
];

export const PROTEINS_GROUP: NutrientType[] = [

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

export const VITAMINS_GROUP: NutrientType[] = [

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

export const MINERALS_GROUP: NutrientType[] = [

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

export const OTHER_GROUP: NutrientType[] = [

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

    ...CARBOHYDRATES_GROUP,
    ...LIPIDS_GROUP,
    ...PROTEINS_GROUP,
    ...VITAMINS_GROUP,
    ...MINERALS_GROUP,
    ...OTHER_GROUP,
];



export interface NutrientDescription {
    type: NutrientType;
    unit: UnitWeight;
    dailyValue?: number;
    isFraction: boolean;
}

export const NUTRIENT_DESCRIPTIONS: Dictionary<NutrientType, NutrientDescription> = {

    // CARBOHYDRATES

    [NutrientType.Carbohydrate]: {
        type: NutrientType.Carbohydrate,
        unit: UnitWeight.g,
        dailyValue: 275,
        isFraction: false,
    },
    [NutrientType.DietaryFiber]: {
        type: NutrientType.DietaryFiber,
        unit: UnitWeight.g,
        dailyValue: 28,
        isFraction: true,
    },
    [NutrientType.Starch]: {
        type: NutrientType.Starch,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Sugars]: {
        type: NutrientType.Sugars,
        unit: UnitWeight.g,
        dailyValue: 50,
        isFraction: true,
    },

    // LIPIDS

    [NutrientType.Fat]: {
        type: NutrientType.Fat,
        unit: UnitWeight.g,
        dailyValue: 78,
        isFraction: false,
    },
    [NutrientType.Monounsaturated]: {
        type: NutrientType.Monounsaturated,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Polyunsaturated]: {
        type: NutrientType.Polyunsaturated,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Omega3]: {
        type: NutrientType.Omega3,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Omega6]: {
        type: NutrientType.Omega6,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Saturated]: {
        type: NutrientType.Saturated,
        unit: UnitWeight.g,
        dailyValue: 20,
        isFraction: true,
    },
    [NutrientType.TransFats]: {
        type: NutrientType.TransFats,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Cholesterol]: {
        type: NutrientType.Cholesterol,
        unit: UnitWeight.mg,
        dailyValue: 300,
        isFraction: true,
    },

    // PROTEINS

    [NutrientType.Protein]: {
        type: NutrientType.Protein,
        unit: UnitWeight.g,
        dailyValue: 50,
        isFraction: false,
    },
    [NutrientType.Tryptophan]: {
        type: NutrientType.Tryptophan,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Threonine]: {
        type: NutrientType.Threonine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Isoleucine]: {
        type: NutrientType.Isoleucine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Leucine]: {
        type: NutrientType.Leucine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Lysine]: {
        type: NutrientType.Lysine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Methionine]: {
        type: NutrientType.Methionine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Cystine]: {
        type: NutrientType.Cystine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Phenylalanine]: {
        type: NutrientType.Phenylalanine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Tyrosine]: {
        type: NutrientType.Tyrosine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Valine]: {
        type: NutrientType.Valine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Arginine]: {
        type: NutrientType.Arginine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Histidine]: {
        type: NutrientType.Histidine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Alanine]: {
        type: NutrientType.Alanine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.AsparticAcid]: {
        type: NutrientType.AsparticAcid,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.GlutamicAcid]: {
        type: NutrientType.GlutamicAcid,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Glycine]: {
        type: NutrientType.Glycine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Proline]: {
        type: NutrientType.Proline,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Serine]: {
        type: NutrientType.Serine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutrientType.Hydroxyproline]: {
        type: NutrientType.Hydroxyproline,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },

    // VITAMINS

    [NutrientType.VitaminA]: {
        type: NutrientType.VitaminA,
        unit: UnitWeight.IU,
        dailyValue: 5000,
        isFraction: false,
    },
    [NutrientType.VitaminC]: {
        type: NutrientType.VitaminC,
        unit: UnitWeight.mg,
        dailyValue: 90,
        isFraction: false,
    },
    [NutrientType.VitaminD]: {
        type: NutrientType.VitaminD,
        unit: UnitWeight.IU,
        dailyValue: 400,
        isFraction: false,
    },
    [NutrientType.VitaminE]: {
        type: NutrientType.VitaminE,
        unit: UnitWeight.mg,
        dailyValue: 15,
        isFraction: false,
    },
    [NutrientType.VitaminK]: {
        type: NutrientType.VitaminK,
        unit: UnitWeight.mcg,
        dailyValue: 120,
        isFraction: false,
    },
    [NutrientType.VitaminB1]: {
        type: NutrientType.VitaminB1,
        unit: UnitWeight.mg,
        dailyValue: 1.2,
        isFraction: false,
    },
    [NutrientType.VitaminB2]: {
        type: NutrientType.VitaminB2,
        unit: UnitWeight.mg,
        dailyValue: 1.3,
        isFraction: false,
    },
    [NutrientType.VitaminB3]: {
        type: NutrientType.VitaminB3,
        unit: UnitWeight.mg,
        dailyValue: 16,
        isFraction: false,
    },
    [NutrientType.VitaminB5]: {
        type: NutrientType.VitaminB5,
        unit: UnitWeight.mg,
        dailyValue: 5,
        isFraction: false,
    },
    [NutrientType.VitaminB6]: {
        type: NutrientType.VitaminB6,
        unit: UnitWeight.mg,
        dailyValue: 1.7,
        isFraction: false,
    },
    [NutrientType.VitaminB9]: {
        type: NutrientType.VitaminB9,
        unit: UnitWeight.mcg,
        dailyValue: 400,
        isFraction: false,
    },
    [NutrientType.VitaminB12]: {
        type: NutrientType.VitaminB12,
        unit: UnitWeight.mcg,
        dailyValue: 2.4,
        isFraction: false,
    },
    [NutrientType.Choline]: {
        type: NutrientType.Choline,
        unit: UnitWeight.mg,
        dailyValue: 550,
        isFraction: false,
    },
    [NutrientType.Betaine]: {
        type: NutrientType.Betaine,
        unit: UnitWeight.mg,
        dailyValue: null,
        isFraction: false,
    },

    // MINERALS

    [NutrientType.Calcium]: {
        type: NutrientType.Calcium,
        unit: UnitWeight.mg,
        dailyValue: 1300,
        isFraction: false,
    },
    [NutrientType.Iron]: {
        type: NutrientType.Iron,
        unit: UnitWeight.mg,
        dailyValue: 18,
        isFraction: false,
    },
    [NutrientType.Magnesium]: {
        type: NutrientType.Magnesium,
        unit: UnitWeight.mg,
        dailyValue: 420,
        isFraction: false,
    },
    [NutrientType.Phosphorus]: {
        type: NutrientType.Phosphorus,
        unit: UnitWeight.mg,
        dailyValue: 1250,
        isFraction: false,
    },
    [NutrientType.Potassium]: {
        type: NutrientType.Potassium,
        unit: UnitWeight.mg,
        dailyValue: 4700,
        isFraction: false,
    },
    [NutrientType.Sodium]: {
        type: NutrientType.Sodium,
        unit: UnitWeight.mg,
        dailyValue: 2300,
        isFraction: false,
    },
    [NutrientType.Zinc]: {
        type: NutrientType.Zinc,
        unit: UnitWeight.mg,
        dailyValue: 11,
        isFraction: false,
    },
    [NutrientType.Copper]: {
        type: NutrientType.Copper,
        unit: UnitWeight.mg,
        dailyValue: 0.9,
        isFraction: false,
    },
    [NutrientType.Manganese]: {
        type: NutrientType.Manganese,
        unit: UnitWeight.mg,
        dailyValue: 2.3,
        isFraction: false,
    },
    [NutrientType.Selenium]: {
        type: NutrientType.Selenium,
        unit: UnitWeight.mcg,
        dailyValue: 55,
        isFraction: false,
    },
    [NutrientType.Fluoride]: {
        type: NutrientType.Fluoride,
        unit: UnitWeight.mcg,
        dailyValue: null,
        isFraction: false,
    },
    [NutrientType.Chromium]: {
        type: NutrientType.Chromium,
        unit: UnitWeight.mcg,
        dailyValue: 35,
        isFraction: false,
    },
    [NutrientType.Iodine]: {
        type: NutrientType.Iodine,
        unit: UnitWeight.mcg,
        dailyValue: 150,
        isFraction: false,
    },
    [NutrientType.Molybdenum]: {
        type: NutrientType.Molybdenum,
        unit: UnitWeight.mcg,
        dailyValue: 45,
        isFraction: false,
    },

    // OTHER

    [NutrientType.Alcohol]: {
        type: NutrientType.Alcohol,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutrientType.Water]: {
        type: NutrientType.Water,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutrientType.Ash]: {
        type: NutrientType.Ash,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutrientType.Caffeine]: {
        type: NutrientType.Caffeine,
        unit: UnitWeight.mg,
        dailyValue: null,
        isFraction: false,
    },
};
