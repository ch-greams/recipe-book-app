import { NutritionFactDescription, NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import { NutritionFactUnit } from "@common/units";



const ENERGY: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Energy]: {
        type: NutritionFactType.Energy,
        unit: NutritionFactUnit.kcal,
        dailyValue: 2000,
        isFraction: false,
    },
    [NutritionFactType.CarbohydrateEnergy]: {
        type: NutritionFactType.CarbohydrateEnergy,
        unit: NutritionFactUnit.kcal,
        dailyValue: 1098,
        isFraction: false,
    },
    [NutritionFactType.FatEnergy]: {
        type: NutritionFactType.FatEnergy,
        unit: NutritionFactUnit.kcal,
        dailyValue: 702,
        isFraction: false,
    },
    [NutritionFactType.ProteinEnergy]: {
        type: NutritionFactType.ProteinEnergy,
        unit: NutritionFactUnit.kcal,
        dailyValue: 200,
        isFraction: false,
    },
};

const CARBOHYDRATES: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Carbohydrate]: {
        type: NutritionFactType.Carbohydrate,
        unit: NutritionFactUnit.g,
        dailyValue: 275,
        isFraction: false,
    },
    [NutritionFactType.DietaryFiber]: {
        type: NutritionFactType.DietaryFiber,
        unit: NutritionFactUnit.g,
        dailyValue: 28,
        isFraction: true,
    },
    [NutritionFactType.Starch]: {
        type: NutritionFactType.Starch,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Sugars]: {
        type: NutritionFactType.Sugars,
        unit: NutritionFactUnit.g,
        dailyValue: 50,
        isFraction: true,
    },
};

const LIPIDS: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Fat]: {
        type: NutritionFactType.Fat,
        unit: NutritionFactUnit.g,
        dailyValue: 78,
        isFraction: false,
    },
    [NutritionFactType.Monounsaturated]: {
        type: NutritionFactType.Monounsaturated,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Polyunsaturated]: {
        type: NutritionFactType.Polyunsaturated,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Omega3]: {
        type: NutritionFactType.Omega3,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Omega6]: {
        type: NutritionFactType.Omega6,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Saturated]: {
        type: NutritionFactType.Saturated,
        unit: NutritionFactUnit.g,
        dailyValue: 20,
        isFraction: true,
    },
    [NutritionFactType.TransFats]: {
        type: NutritionFactType.TransFats,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Cholesterol]: {
        type: NutritionFactType.Cholesterol,
        unit: NutritionFactUnit.mg,
        dailyValue: 300,
        isFraction: true,
    },
};

const PROTEINS: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Protein]: {
        type: NutritionFactType.Protein,
        unit: NutritionFactUnit.g,
        dailyValue: 50,
        isFraction: false,
    },
    [NutritionFactType.Tryptophan]: {
        type: NutritionFactType.Tryptophan,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Threonine]: {
        type: NutritionFactType.Threonine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Isoleucine]: {
        type: NutritionFactType.Isoleucine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Leucine]: {
        type: NutritionFactType.Leucine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Lysine]: {
        type: NutritionFactType.Lysine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Methionine]: {
        type: NutritionFactType.Methionine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Cystine]: {
        type: NutritionFactType.Cystine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Phenylalanine]: {
        type: NutritionFactType.Phenylalanine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Tyrosine]: {
        type: NutritionFactType.Tyrosine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Valine]: {
        type: NutritionFactType.Valine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Arginine]: {
        type: NutritionFactType.Arginine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Histidine]: {
        type: NutritionFactType.Histidine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Alanine]: {
        type: NutritionFactType.Alanine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.AsparticAcid]: {
        type: NutritionFactType.AsparticAcid,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.GlutamicAcid]: {
        type: NutritionFactType.GlutamicAcid,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Glycine]: {
        type: NutritionFactType.Glycine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Proline]: {
        type: NutritionFactType.Proline,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Serine]: {
        type: NutritionFactType.Serine,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
    [NutritionFactType.Hydroxyproline]: {
        type: NutritionFactType.Hydroxyproline,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: true,
    },
};

const VITAMINS: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.VitaminA]: {
        type: NutritionFactType.VitaminA,
        unit: NutritionFactUnit.IU,
        dailyValue: 5000,
        isFraction: false,
    },
    [NutritionFactType.VitaminC]: {
        type: NutritionFactType.VitaminC,
        unit: NutritionFactUnit.mg,
        dailyValue: 90,
        isFraction: false,
    },
    [NutritionFactType.VitaminD]: {
        type: NutritionFactType.VitaminD,
        unit: NutritionFactUnit.IU,
        dailyValue: 400,
        isFraction: false,
    },
    [NutritionFactType.VitaminE]: {
        type: NutritionFactType.VitaminE,
        unit: NutritionFactUnit.mg,
        dailyValue: 15,
        isFraction: false,
    },
    [NutritionFactType.VitaminK]: {
        type: NutritionFactType.VitaminK,
        unit: NutritionFactUnit.mcg,
        dailyValue: 120,
        isFraction: false,
    },
    [NutritionFactType.VitaminB1]: {
        type: NutritionFactType.VitaminB1,
        unit: NutritionFactUnit.mg,
        dailyValue: 1.2,
        isFraction: false,
    },
    [NutritionFactType.VitaminB2]: {
        type: NutritionFactType.VitaminB2,
        unit: NutritionFactUnit.mg,
        dailyValue: 1.3,
        isFraction: false,
    },
    [NutritionFactType.VitaminB3]: {
        type: NutritionFactType.VitaminB3,
        unit: NutritionFactUnit.mg,
        dailyValue: 16,
        isFraction: false,
    },
    [NutritionFactType.VitaminB5]: {
        type: NutritionFactType.VitaminB5,
        unit: NutritionFactUnit.mg,
        dailyValue: 5,
        isFraction: false,
    },
    [NutritionFactType.VitaminB6]: {
        type: NutritionFactType.VitaminB6,
        unit: NutritionFactUnit.mg,
        dailyValue: 1.7,
        isFraction: false,
    },
    [NutritionFactType.VitaminB9]: {
        type: NutritionFactType.VitaminB9,
        unit: NutritionFactUnit.mcg,
        dailyValue: 400,
        isFraction: false,
    },
    [NutritionFactType.VitaminB12]: {
        type: NutritionFactType.VitaminB12,
        unit: NutritionFactUnit.mcg,
        dailyValue: 2.4,
        isFraction: false,
    },
    [NutritionFactType.Choline]: {
        type: NutritionFactType.Choline,
        unit: NutritionFactUnit.mg,
        dailyValue: 550,
        isFraction: false,
    },
    [NutritionFactType.Betaine]: {
        type: NutritionFactType.Betaine,
        unit: NutritionFactUnit.mg,
        dailyValue: null,
        isFraction: false,
    },
};

const MINERALS: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Calcium]: {
        type: NutritionFactType.Calcium,
        unit: NutritionFactUnit.mg,
        dailyValue: 1300,
        isFraction: false,
    },
    [NutritionFactType.Iron]: {
        type: NutritionFactType.Iron,
        unit: NutritionFactUnit.mg,
        dailyValue: 18,
        isFraction: false,
    },
    [NutritionFactType.Magnesium]: {
        type: NutritionFactType.Magnesium,
        unit: NutritionFactUnit.mg,
        dailyValue: 420,
        isFraction: false,
    },
    [NutritionFactType.Phosphorus]: {
        type: NutritionFactType.Phosphorus,
        unit: NutritionFactUnit.mg,
        dailyValue: 1250,
        isFraction: false,
    },
    [NutritionFactType.Potassium]: {
        type: NutritionFactType.Potassium,
        unit: NutritionFactUnit.mg,
        dailyValue: 4700,
        isFraction: false,
    },
    [NutritionFactType.Sodium]: {
        type: NutritionFactType.Sodium,
        unit: NutritionFactUnit.mg,
        dailyValue: 2300,
        isFraction: false,
    },
    [NutritionFactType.Zinc]: {
        type: NutritionFactType.Zinc,
        unit: NutritionFactUnit.mg,
        dailyValue: 11,
        isFraction: false,
    },
    [NutritionFactType.Copper]: {
        type: NutritionFactType.Copper,
        unit: NutritionFactUnit.mg,
        dailyValue: 0.9,
        isFraction: false,
    },
    [NutritionFactType.Manganese]: {
        type: NutritionFactType.Manganese,
        unit: NutritionFactUnit.mg,
        dailyValue: 2.3,
        isFraction: false,
    },
    [NutritionFactType.Selenium]: {
        type: NutritionFactType.Selenium,
        unit: NutritionFactUnit.mcg,
        dailyValue: 55,
        isFraction: false,
    },
    [NutritionFactType.Fluoride]: {
        type: NutritionFactType.Fluoride,
        unit: NutritionFactUnit.mcg,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Chromium]: {
        type: NutritionFactType.Chromium,
        unit: NutritionFactUnit.mcg,
        dailyValue: 35,
        isFraction: false,
    },
    [NutritionFactType.Iodine]: {
        type: NutritionFactType.Iodine,
        unit: NutritionFactUnit.mcg,
        dailyValue: 150,
        isFraction: false,
    },
    [NutritionFactType.Molybdenum]: {
        type: NutritionFactType.Molybdenum,
        unit: NutritionFactUnit.mcg,
        dailyValue: 45,
        isFraction: false,
    },
};

const OTHER: Dictionary<NutritionFactType, NutritionFactDescription> = {

    [NutritionFactType.Alcohol]: {
        type: NutritionFactType.Alcohol,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Water]: {
        type: NutritionFactType.Water,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Ash]: {
        type: NutritionFactType.Ash,
        unit: NutritionFactUnit.g,
        dailyValue: null,
        isFraction: false,
    },
    [NutritionFactType.Caffeine]: {
        type: NutritionFactType.Caffeine,
        unit: NutritionFactUnit.mg,
        dailyValue: null,
        isFraction: false,
    },
};

export default {

    ...ENERGY,
    ...CARBOHYDRATES,
    ...LIPIDS,
    ...PROTEINS,
    ...VITAMINS,
    ...MINERALS,
    ...OTHER,
};
