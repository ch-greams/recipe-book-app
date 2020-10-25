import { Dictionary } from "./typings";
import { UnitEnergy, UnitWeight } from "./units";


export enum NutritionFactType {

    Energy = "Energy",
    CarbohydrateEnergy = "CarbohydrateEnergy",
    FatEnergy = "FatEnergy",
    ProteinEnergy = "ProteinEnergy",

    // Carbohydrates
    Carbohydrate = "Carbohydrate",
    DietaryFiber = "DietaryFiber",
    Starch = "Starch",
    Sugars = "Sugars",

    // Lipids
    Fat = "Fat",
    Monounsaturated = "Monounsaturated",
    Polyunsaturated = "Polyunsaturated",
    Omega3 = "Omega3",
    Omega6 = "Omega6",
    Saturated = "Saturated",
    TransFats = "TransFats",
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
    AsparticAcid = "AsparticAcid",
    GlutamicAcid = "GlutamicAcid",
    Glycine = "Glycine",
    Proline = "Proline",
    Serine = "Serine",
    Hydroxyproline = "Hydroxyproline",

    // Vitamins
    VitaminA = "VitaminA",
    VitaminC = "VitaminC",
    VitaminD = "VitaminD",
    VitaminE = "VitaminE",
    VitaminK = "VitaminK",
    VitaminB1 = "VitaminB1",
    VitaminB2 = "VitaminB2",
    VitaminB3 = "VitaminB3",
    VitaminB5 = "VitaminB5",
    VitaminB6 = "VitaminB6",
    VitaminB9 = "VitaminB9",
    VitaminB12 = "VitaminB12",
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

enum NutritionFactTypeLabel {

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

export const nutritionFactTypeLabelMapping: Dictionary<NutritionFactType, NutritionFactTypeLabel> = {

    [NutritionFactType.Energy]: NutritionFactTypeLabel.Energy,
    [NutritionFactType.CarbohydrateEnergy]: NutritionFactTypeLabel.CarbohydrateEnergy,
    [NutritionFactType.FatEnergy]: NutritionFactTypeLabel.FatEnergy,
    [NutritionFactType.ProteinEnergy]: NutritionFactTypeLabel.ProteinEnergy,

    // Carbohydrates
    [NutritionFactType.Carbohydrate]: NutritionFactTypeLabel.Carbohydrate,
    [NutritionFactType.DietaryFiber]: NutritionFactTypeLabel.DietaryFiber,
    [NutritionFactType.Starch]: NutritionFactTypeLabel.Starch,
    [NutritionFactType.Sugars]: NutritionFactTypeLabel.Sugars,

    // Lipids
    [NutritionFactType.Fat]: NutritionFactTypeLabel.Fat,
    [NutritionFactType.Monounsaturated]: NutritionFactTypeLabel.Monounsaturated,
    [NutritionFactType.Polyunsaturated]: NutritionFactTypeLabel.Polyunsaturated,
    [NutritionFactType.Omega3]: NutritionFactTypeLabel.Omega3,
    [NutritionFactType.Omega6]: NutritionFactTypeLabel.Omega6,
    [NutritionFactType.Saturated]: NutritionFactTypeLabel.Saturated,
    [NutritionFactType.TransFats]: NutritionFactTypeLabel.TransFats,
    [NutritionFactType.Cholesterol]: NutritionFactTypeLabel.Cholesterol,
    [NutritionFactType.Phytosterol]: NutritionFactTypeLabel.Phytosterol,

    // Proteins & Amino Acids
    [NutritionFactType.Protein]: NutritionFactTypeLabel.Protein,
    [NutritionFactType.Tryptophan]: NutritionFactTypeLabel.Tryptophan,
    [NutritionFactType.Threonine]: NutritionFactTypeLabel.Threonine,
    [NutritionFactType.Isoleucine]: NutritionFactTypeLabel.Isoleucine,
    [NutritionFactType.Leucine]: NutritionFactTypeLabel.Leucine,
    [NutritionFactType.Lysine]: NutritionFactTypeLabel.Lysine,
    [NutritionFactType.Methionine]: NutritionFactTypeLabel.Methionine,
    [NutritionFactType.Cystine]: NutritionFactTypeLabel.Cystine,
    [NutritionFactType.Phenylalanine]: NutritionFactTypeLabel.Phenylalanine,
    [NutritionFactType.Tyrosine]: NutritionFactTypeLabel.Tyrosine,
    [NutritionFactType.Valine]: NutritionFactTypeLabel.Valine,
    [NutritionFactType.Arginine]: NutritionFactTypeLabel.Arginine,
    [NutritionFactType.Histidine]: NutritionFactTypeLabel.Histidine,
    [NutritionFactType.Alanine]: NutritionFactTypeLabel.Alanine,
    [NutritionFactType.AsparticAcid]: NutritionFactTypeLabel.AsparticAcid,
    [NutritionFactType.GlutamicAcid]: NutritionFactTypeLabel.GlutamicAcid,
    [NutritionFactType.Glycine]: NutritionFactTypeLabel.Glycine,
    [NutritionFactType.Proline]: NutritionFactTypeLabel.Proline,
    [NutritionFactType.Serine]: NutritionFactTypeLabel.Serine,
    [NutritionFactType.Hydroxyproline]: NutritionFactTypeLabel.Hydroxyproline,

    // Vitamins
    [NutritionFactType.VitaminA]: NutritionFactTypeLabel.VitaminA,
    [NutritionFactType.VitaminC]: NutritionFactTypeLabel.VitaminC,
    [NutritionFactType.VitaminD]: NutritionFactTypeLabel.VitaminD,
    [NutritionFactType.VitaminE]: NutritionFactTypeLabel.VitaminE,
    [NutritionFactType.VitaminK]: NutritionFactTypeLabel.VitaminK,
    [NutritionFactType.VitaminB1]: NutritionFactTypeLabel.VitaminB1,
    [NutritionFactType.VitaminB2]: NutritionFactTypeLabel.VitaminB2,
    [NutritionFactType.VitaminB3]: NutritionFactTypeLabel.VitaminB3,
    [NutritionFactType.VitaminB5]: NutritionFactTypeLabel.VitaminB5,
    [NutritionFactType.VitaminB6]: NutritionFactTypeLabel.VitaminB6,
    [NutritionFactType.VitaminB9]: NutritionFactTypeLabel.VitaminB9,
    [NutritionFactType.VitaminB12]: NutritionFactTypeLabel.VitaminB12,
    [NutritionFactType.Choline]: NutritionFactTypeLabel.Choline,
    [NutritionFactType.Betaine]: NutritionFactTypeLabel.Betaine,

    // Minerals
    [NutritionFactType.Calcium]: NutritionFactTypeLabel.Calcium,
    [NutritionFactType.Iron]: NutritionFactTypeLabel.Iron,
    [NutritionFactType.Magnesium]: NutritionFactTypeLabel.Magnesium,
    [NutritionFactType.Phosphorus]: NutritionFactTypeLabel.Phosphorus,
    [NutritionFactType.Potassium]: NutritionFactTypeLabel.Potassium,
    [NutritionFactType.Sodium]: NutritionFactTypeLabel.Sodium,
    [NutritionFactType.Zinc]: NutritionFactTypeLabel.Zinc,
    [NutritionFactType.Copper]: NutritionFactTypeLabel.Copper,
    [NutritionFactType.Manganese]: NutritionFactTypeLabel.Manganese,
    [NutritionFactType.Selenium]: NutritionFactTypeLabel.Selenium,
    [NutritionFactType.Fluoride]: NutritionFactTypeLabel.Fluoride,
    [NutritionFactType.Chromium]: NutritionFactTypeLabel.Chromium,
    [NutritionFactType.Iodine]: NutritionFactTypeLabel.Iodine,
    [NutritionFactType.Molybdenum]: NutritionFactTypeLabel.Molybdenum,

    // Other
    [NutritionFactType.Alcohol]: NutritionFactTypeLabel.Alcohol,
    [NutritionFactType.Water]: NutritionFactTypeLabel.Water,
    [NutritionFactType.Ash]: NutritionFactTypeLabel.Ash,
    [NutritionFactType.Caffeine]: NutritionFactTypeLabel.Caffeine,
};


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
