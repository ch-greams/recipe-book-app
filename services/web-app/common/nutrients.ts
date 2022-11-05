import type { NutrientUnit } from "./units";

export enum NutrientName {

    Energy = "energy",
    CarbohydrateEnergy = "carbohydrate_energy",
    FatEnergy = "fat_energy",
    ProteinEnergy = "protein_energy",

    // Carbohydrate
    Carbohydrate = "carbohydrate",
    DietaryFiber = "dietary_fiber",
    Starch = "starch",
    Sugars = "sugars",

    // Lipid
    Fat = "fat",
    Monounsaturated = "monounsaturated",
    Polyunsaturated = "polyunsaturated",
    Omega3 = "omega_3",
    Omega6 = "omega_6",
    Saturated = "saturated",
    TransFats = "trans_fats",
    Cholesterol = "cholesterol",
    Phytosterol = "phytosterol",

    // Protein
    Protein = "protein",
    Tryptophan = "tryptophan",
    Threonine = "threonine",
    Isoleucine = "isoleucine",
    Leucine = "leucine",
    Lysine = "lysine",
    Methionine = "methionine",
    Cystine = "cystine",
    Phenylalanine = "phenylalanine",
    Tyrosine = "tyrosine",
    Valine = "valine",
    Arginine = "arginine",
    Histidine = "histidine",
    Alanine = "alanine",
    AsparticAcid = "aspartic_acid",
    GlutamicAcid = "glutamic_acid",
    Glycine = "glycine",
    Proline = "proline",
    Serine = "serine",
    Hydroxyproline = "hydroxyproline",

    // Vitamin
    VitaminA = "vitamin_a",
    VitaminC = "vitamin_c",
    VitaminD = "vitamin_d",
    VitaminE = "vitamin_e",
    VitaminK = "vitamin_k",
    VitaminB1 = "vitamin_b1",
    VitaminB2 = "vitamin_b2",
    VitaminB3 = "vitamin_b3",
    VitaminB5 = "vitamin_b5",
    VitaminB6 = "vitamin_b6",
    VitaminB7 = "vitamin_b7",
    VitaminB9 = "vitamin_b9",
    VitaminB12 = "vitamin_b12",
    Choline = "choline",
    Betaine = "betaine",

    // Mineral
    Calcium = "calcium",
    Iron = "iron",
    Magnesium = "magnesium",
    Phosphorus = "phosphorus",
    Potassium = "potassium",
    Sodium = "sodium",
    Zinc = "zinc",
    Copper = "copper",
    Manganese = "manganese",
    Selenium = "selenium",
    Fluoride = "fluoride",
    Chloride = "chloride",
    Chromium = "chromium",
    Iodine = "iodine",
    Molybdenum = "molybdenum",

    // Other
    Alcohol = "alcohol",
    Water = "water",
    Ash = "ash",
    Caffeine = "caffeine",
}

export const EnergyNutrients: NutrientName[] = [
    NutrientName.Energy,
    NutrientName.CarbohydrateEnergy,
    NutrientName.FatEnergy,
    NutrientName.ProteinEnergy,
];

export const CarbohydrateNutrients: NutrientName[] = [
    NutrientName.Carbohydrate,
    NutrientName.DietaryFiber,
    NutrientName.Starch,
    NutrientName.Sugars,
];

export const LipidNutrients: NutrientName[] = [
    NutrientName.Fat,
    NutrientName.Monounsaturated,
    NutrientName.Polyunsaturated,
    NutrientName.Omega3,
    NutrientName.Omega6,
    NutrientName.Saturated,
    NutrientName.TransFats,
    NutrientName.Cholesterol,
    NutrientName.Phytosterol,
];

export const ProteinNutrients: NutrientName[] = [
    NutrientName.Protein,
    NutrientName.Tryptophan,
    NutrientName.Threonine,
    NutrientName.Isoleucine,
    NutrientName.Leucine,
    NutrientName.Lysine,
    NutrientName.Methionine,
    NutrientName.Cystine,
    NutrientName.Phenylalanine,
    NutrientName.Tyrosine,
    NutrientName.Valine,
    NutrientName.Arginine,
    NutrientName.Histidine,
    NutrientName.Alanine,
    NutrientName.AsparticAcid,
    NutrientName.GlutamicAcid,
    NutrientName.Glycine,
    NutrientName.Proline,
    NutrientName.Serine,
    NutrientName.Hydroxyproline,
];

export const VitaminNutrients: NutrientName[] = [
    NutrientName.VitaminA,
    NutrientName.VitaminC,
    NutrientName.VitaminD,
    NutrientName.VitaminE,
    NutrientName.VitaminK,
    NutrientName.VitaminB1,
    NutrientName.VitaminB2,
    NutrientName.VitaminB3,
    NutrientName.VitaminB5,
    NutrientName.VitaminB6,
    NutrientName.VitaminB7,
    NutrientName.VitaminB9,
    NutrientName.VitaminB12,
    NutrientName.Choline,
    NutrientName.Betaine,
];

export const MineralNutrients: NutrientName[] = [
    NutrientName.Calcium,
    NutrientName.Iron,
    NutrientName.Magnesium,
    NutrientName.Phosphorus,
    NutrientName.Potassium,
    NutrientName.Sodium,
    NutrientName.Zinc,
    NutrientName.Copper,
    NutrientName.Manganese,
    NutrientName.Selenium,
    NutrientName.Fluoride,
    NutrientName.Chloride,
    NutrientName.Chromium,
    NutrientName.Iodine,
    NutrientName.Molybdenum,
];

export const OtherNutrients: NutrientName[] = [
    NutrientName.Alcohol,
    NutrientName.Water,
    NutrientName.Ash,
    NutrientName.Caffeine,
];


export const NUTRIENT_TYPE_LABEL_MAPPING: Dictionary<NutrientName, string> = {

    [NutrientName.Energy]: "Energy",
    [NutrientName.CarbohydrateEnergy]: "Carbohydrate Energy",
    [NutrientName.FatEnergy]: "Fat Energy",
    [NutrientName.ProteinEnergy]: "Protein Energy",

    // Carbohydrates
    [NutrientName.Carbohydrate]: "Carbohydrate",
    [NutrientName.DietaryFiber]: "Dietary Fiber",
    [NutrientName.Starch]: "Starch",
    [NutrientName.Sugars]: "Sugars",

    // Lipids
    [NutrientName.Fat]: "Fat",
    [NutrientName.Monounsaturated]: "Monounsaturated",
    [NutrientName.Polyunsaturated]: "Polyunsaturated",
    [NutrientName.Omega3]: "Omega-3",
    [NutrientName.Omega6]: "Omega-6",
    [NutrientName.Saturated]: "Saturated",
    [NutrientName.TransFats]: "Trans-Fats",
    [NutrientName.Cholesterol]: "Cholesterol",
    [NutrientName.Phytosterol]: "Phytosterol",

    // Proteins & Amino Acids
    [NutrientName.Protein]: "Protein",
    [NutrientName.Tryptophan]: "Tryptophan",
    [NutrientName.Threonine]: "Threonine",
    [NutrientName.Isoleucine]: "Isoleucine",
    [NutrientName.Leucine]: "Leucine",
    [NutrientName.Lysine]: "Lysine",
    [NutrientName.Methionine]: "Methionine",
    [NutrientName.Cystine]: "Cystine",
    [NutrientName.Phenylalanine]: "Phenylalanine",
    [NutrientName.Tyrosine]: "Tyrosine",
    [NutrientName.Valine]: "Valine",
    [NutrientName.Arginine]: "Arginine",
    [NutrientName.Histidine]: "Histidine",
    [NutrientName.Alanine]: "Alanine",
    [NutrientName.AsparticAcid]: "Aspartic Acid",
    [NutrientName.GlutamicAcid]: "Glutamic Acid",
    [NutrientName.Glycine]: "Glycine",
    [NutrientName.Proline]: "Proline",
    [NutrientName.Serine]: "Serine",
    [NutrientName.Hydroxyproline]: "Hydroxyproline",

    // Vitamins
    [NutrientName.VitaminA]: "Vitamin A",
    [NutrientName.VitaminC]: "Vitamin C",
    [NutrientName.VitaminD]: "Vitamin D",
    [NutrientName.VitaminE]: "Vitamin E",
    [NutrientName.VitaminK]: "Vitamin K",
    [NutrientName.VitaminB1]: "B1 - Thiamin",
    [NutrientName.VitaminB2]: "B2 - Riboflavin",
    [NutrientName.VitaminB3]: "B3 - Niacin",
    [NutrientName.VitaminB5]: "B5 - Pantothenic Acid",
    [NutrientName.VitaminB6]: "B6 - Pyridoxine",
    [NutrientName.VitaminB7]: "B7 - Biotin",
    [NutrientName.VitaminB9]: "B9 - Folate",
    [NutrientName.VitaminB12]: "B12 - Cobalamin",
    [NutrientName.Choline]: "Choline",
    [NutrientName.Betaine]: "Betaine",

    // Minerals
    [NutrientName.Calcium]: "Calcium",
    [NutrientName.Iron]: "Iron",
    [NutrientName.Magnesium]: "Magnesium",
    [NutrientName.Phosphorus]: "Phosphorus",
    [NutrientName.Potassium]: "Potassium",
    [NutrientName.Sodium]: "Sodium",
    [NutrientName.Zinc]: "Zinc",
    [NutrientName.Copper]: "Copper",
    [NutrientName.Manganese]: "Manganese",
    [NutrientName.Selenium]: "Selenium",
    [NutrientName.Fluoride]: "Fluoride",
    [NutrientName.Chloride]: "Chloride",
    [NutrientName.Chromium]: "Chromium",
    [NutrientName.Iodine]: "Iodine",
    [NutrientName.Molybdenum]: "Molybdenum",

    // Other
    [NutrientName.Alcohol]: "Alcohol",
    [NutrientName.Water]: "Water",
    [NutrientName.Ash]: "Ash",
    [NutrientName.Caffeine]: "Caffeine",
};

export enum NutrientGroupType {

    Carbohydrates = "Carbohydrates",
    Lipids = "Lipids",
    Proteins = "Proteins & Amino Acids",
    Vitamins = "Vitamins",
    Minerals = "Minerals",
    Other = "Other",
}

export interface NutrientDescription {
    type: NutrientName;
    unit: NutrientUnit;
    dailyValue?: Option<number>;
    isFraction: boolean;
}
