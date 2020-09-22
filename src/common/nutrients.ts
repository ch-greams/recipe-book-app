import { Dictionary } from "./typings";
import { UnitEnergy, UnitWeight } from "./units";



export enum NutritionFactType {

    Energy = "Energy",

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

export const NUTRITION_FACT_DESCRIPTIONS: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Energy]: {
        type: NutritionFactType.Energy,
        unit: UnitEnergy.kcal,
        dailyValue: 2000,
        isFraction: false,
    },

    // CARBOHYDRATES

    [NutritionFactType.Carbohydrate]: {
        type: NutritionFactType.Carbohydrate,
        unit: UnitWeight.g,
        dailyValue: 275,
        isFraction: false,
    },
    [NutritionFactType.DietaryFiber]: {
        type: NutritionFactType.DietaryFiber,
        unit: UnitWeight.g,
        dailyValue: 28,
        isFraction: true,
    },
    [NutritionFactType.Starch]: {
        type: NutritionFactType.Starch,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Sugars]: {
        type: NutritionFactType.Sugars,
        unit: UnitWeight.g,
        dailyValue: 50,
        isFraction: true,
    },

    // LIPIDS

    [NutritionFactType.Fat]: {
        type: NutritionFactType.Fat,
        unit: UnitWeight.g,
        dailyValue: 78,
        isFraction: false,
    },
    [NutritionFactType.Monounsaturated]: {
        type: NutritionFactType.Monounsaturated,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Polyunsaturated]: {
        type: NutritionFactType.Polyunsaturated,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Omega3]: {
        type: NutritionFactType.Omega3,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Omega6]: {
        type: NutritionFactType.Omega6,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Saturated]: {
        type: NutritionFactType.Saturated,
        unit: UnitWeight.g,
        dailyValue: 20,
        isFraction: true,
    },
    [NutritionFactType.TransFats]: {
        type: NutritionFactType.TransFats,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Cholesterol]: {
        type: NutritionFactType.Cholesterol,
        unit: UnitWeight.mg,
        dailyValue: 300,
        isFraction: true,
    },

    // PROTEINS

    [NutritionFactType.Protein]: {
        type: NutritionFactType.Protein,
        unit: UnitWeight.g,
        dailyValue: 50,
        isFraction: false,
    },
    [NutritionFactType.Tryptophan]: {
        type: NutritionFactType.Tryptophan,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Threonine]: {
        type: NutritionFactType.Threonine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Isoleucine]: {
        type: NutritionFactType.Isoleucine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Leucine]: {
        type: NutritionFactType.Leucine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Lysine]: {
        type: NutritionFactType.Lysine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Methionine]: {
        type: NutritionFactType.Methionine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Cystine]: {
        type: NutritionFactType.Cystine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Phenylalanine]: {
        type: NutritionFactType.Phenylalanine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Tyrosine]: {
        type: NutritionFactType.Tyrosine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Valine]: {
        type: NutritionFactType.Valine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Arginine]: {
        type: NutritionFactType.Arginine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Histidine]: {
        type: NutritionFactType.Histidine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Alanine]: {
        type: NutritionFactType.Alanine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.AsparticAcid]: {
        type: NutritionFactType.AsparticAcid,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.GlutamicAcid]: {
        type: NutritionFactType.GlutamicAcid,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Glycine]: {
        type: NutritionFactType.Glycine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Proline]: {
        type: NutritionFactType.Proline,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Serine]: {
        type: NutritionFactType.Serine,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Hydroxyproline]: {
        type: NutritionFactType.Hydroxyproline,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: true,
    },

    // VITAMINS

    [NutritionFactType.VitaminA]: {
        type: NutritionFactType.VitaminA,
        unit: UnitWeight.IU,
        dailyValue: 5000,
        isFraction: false,
    },
    [NutritionFactType.VitaminC]: {
        type: NutritionFactType.VitaminC,
        unit: UnitWeight.mg,
        dailyValue: 90,
        isFraction: false,
    },
    [NutritionFactType.VitaminD]: {
        type: NutritionFactType.VitaminD,
        unit: UnitWeight.IU,
        dailyValue: 400,
        isFraction: false,
    },
    [NutritionFactType.VitaminE]: {
        type: NutritionFactType.VitaminE,
        unit: UnitWeight.mg,
        dailyValue: 15,
        isFraction: false,
    },
    [NutritionFactType.VitaminK]: {
        type: NutritionFactType.VitaminK,
        unit: UnitWeight.mcg,
        dailyValue: 120,
        isFraction: false,
    },
    [NutritionFactType.VitaminB1]: {
        type: NutritionFactType.VitaminB1,
        unit: UnitWeight.mg,
        dailyValue: 1.2,
        isFraction: false,
    },
    [NutritionFactType.VitaminB2]: {
        type: NutritionFactType.VitaminB2,
        unit: UnitWeight.mg,
        dailyValue: 1.3,
        isFraction: false,
    },
    [NutritionFactType.VitaminB3]: {
        type: NutritionFactType.VitaminB3,
        unit: UnitWeight.mg,
        dailyValue: 16,
        isFraction: false,
    },
    [NutritionFactType.VitaminB5]: {
        type: NutritionFactType.VitaminB5,
        unit: UnitWeight.mg,
        dailyValue: 5,
        isFraction: false,
    },
    [NutritionFactType.VitaminB6]: {
        type: NutritionFactType.VitaminB6,
        unit: UnitWeight.mg,
        dailyValue: 1.7,
        isFraction: false,
    },
    [NutritionFactType.VitaminB9]: {
        type: NutritionFactType.VitaminB9,
        unit: UnitWeight.mcg,
        dailyValue: 400,
        isFraction: false,
    },
    [NutritionFactType.VitaminB12]: {
        type: NutritionFactType.VitaminB12,
        unit: UnitWeight.mcg,
        dailyValue: 2.4,
        isFraction: false,
    },
    [NutritionFactType.Choline]: {
        type: NutritionFactType.Choline,
        unit: UnitWeight.mg,
        dailyValue: 550,
        isFraction: false,
    },
    [NutritionFactType.Betaine]: {
        type: NutritionFactType.Betaine,
        unit: UnitWeight.mg,
        dailyValue: null,
        isFraction: false,
    },

    // MINERALS

    [NutritionFactType.Calcium]: {
        type: NutritionFactType.Calcium,
        unit: UnitWeight.mg,
        dailyValue: 1300,
        isFraction: false,
    },
    [NutritionFactType.Iron]: {
        type: NutritionFactType.Iron,
        unit: UnitWeight.mg,
        dailyValue: 18,
        isFraction: false,
    },
    [NutritionFactType.Magnesium]: {
        type: NutritionFactType.Magnesium,
        unit: UnitWeight.mg,
        dailyValue: 420,
        isFraction: false,
    },
    [NutritionFactType.Phosphorus]: {
        type: NutritionFactType.Phosphorus,
        unit: UnitWeight.mg,
        dailyValue: 1250,
        isFraction: false,
    },
    [NutritionFactType.Potassium]: {
        type: NutritionFactType.Potassium,
        unit: UnitWeight.mg,
        dailyValue: 4700,
        isFraction: false,
    },
    [NutritionFactType.Sodium]: {
        type: NutritionFactType.Sodium,
        unit: UnitWeight.mg,
        dailyValue: 2300,
        isFraction: false,
    },
    [NutritionFactType.Zinc]: {
        type: NutritionFactType.Zinc,
        unit: UnitWeight.mg,
        dailyValue: 11,
        isFraction: false,
    },
    [NutritionFactType.Copper]: {
        type: NutritionFactType.Copper,
        unit: UnitWeight.mg,
        dailyValue: 0.9,
        isFraction: false,
    },
    [NutritionFactType.Manganese]: {
        type: NutritionFactType.Manganese,
        unit: UnitWeight.mg,
        dailyValue: 2.3,
        isFraction: false,
    },
    [NutritionFactType.Selenium]: {
        type: NutritionFactType.Selenium,
        unit: UnitWeight.mcg,
        dailyValue: 55,
        isFraction: false,
    },
    [NutritionFactType.Fluoride]: {
        type: NutritionFactType.Fluoride,
        unit: UnitWeight.mcg,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Chromium]: {
        type: NutritionFactType.Chromium,
        unit: UnitWeight.mcg,
        dailyValue: 35,
        isFraction: false,
    },
    [NutritionFactType.Iodine]: {
        type: NutritionFactType.Iodine,
        unit: UnitWeight.mcg,
        dailyValue: 150,
        isFraction: false,
    },
    [NutritionFactType.Molybdenum]: {
        type: NutritionFactType.Molybdenum,
        unit: UnitWeight.mcg,
        dailyValue: 45,
        isFraction: false,
    },

    // OTHER

    [NutritionFactType.Alcohol]: {
        type: NutritionFactType.Alcohol,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Water]: {
        type: NutritionFactType.Water,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Ash]: {
        type: NutritionFactType.Ash,
        unit: UnitWeight.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Caffeine]: {
        type: NutritionFactType.Caffeine,
        unit: UnitWeight.mg,
        dailyValue: null,
        isFraction: false,
    },
};
