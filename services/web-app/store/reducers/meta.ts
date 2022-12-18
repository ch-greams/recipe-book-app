import { createReducer } from "@reduxjs/toolkit";

import { getErrorMessageFromStatus } from "@common/http";
import { NutrientName } from "@common/nutrients";
import { mapRecord } from "@common/object";
import { isSome } from "@common/types";
import { NutrientUnit } from "@common/units";
import { fetchNutrients } from "@store/actions/meta";
import type { MetaStore } from "@store/types/meta";


const NUTRIENT_DESCRIPTIONS: Record<NutrientName, { unit: NutrientUnit, isFraction: boolean }> = {
    [NutrientName.Energy]:              { unit: NutrientUnit.kcal, isFraction: false },
    [NutrientName.CarbohydrateEnergy]:  { unit: NutrientUnit.kcal, isFraction: false },
    [NutrientName.FatEnergy]:           { unit: NutrientUnit.kcal, isFraction: false },
    [NutrientName.ProteinEnergy]:       { unit: NutrientUnit.kcal, isFraction: false },
    [NutrientName.Carbohydrate]:        { unit: NutrientUnit.g,    isFraction: false },
    [NutrientName.DietaryFiber]:        { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Starch]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Sugars]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Fat]:                 { unit: NutrientUnit.g,    isFraction: false },
    [NutrientName.Monounsaturated]:     { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Polyunsaturated]:     { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Omega3]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Omega6]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Saturated]:           { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.TransFats]:           { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Cholesterol]:         { unit: NutrientUnit.mg,   isFraction: true },
    [NutrientName.Phytosterol]:         { unit: NutrientUnit.mg,   isFraction: true },
    [NutrientName.Protein]:             { unit: NutrientUnit.g,    isFraction: false },
    [NutrientName.Tryptophan]:          { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Threonine]:           { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Isoleucine]:          { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Leucine]:             { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Lysine]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Methionine]:          { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Cystine]:             { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Phenylalanine]:       { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Tyrosine]:            { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Valine]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Arginine]:            { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Histidine]:           { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Alanine]:             { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.AsparticAcid]:        { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.GlutamicAcid]:        { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Glycine]:             { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Proline]:             { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Serine]:              { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.Hydroxyproline]:      { unit: NutrientUnit.g,    isFraction: true },
    [NutrientName.VitaminA]:            { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.VitaminC]:            { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminD]:            { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.VitaminE]:            { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminK]:            { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.VitaminB1]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminB2]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminB3]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminB5]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminB6]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.VitaminB7]:           { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.VitaminB9]:           { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.VitaminB12]:          { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.Choline]:             { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Betaine]:             { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Calcium]:             { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Iron]:                { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Magnesium]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Phosphorus]:          { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Potassium]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Sodium]:              { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Zinc]:                { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Copper]:              { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Manganese]:           { unit: NutrientUnit.mg,   isFraction: false },
    [NutrientName.Selenium]:            { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.Fluoride]:            { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.Chromium]:            { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.Iodine]:              { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.Molybdenum]:          { unit: NutrientUnit.mcg,  isFraction: false },
    [NutrientName.Alcohol]:             { unit: NutrientUnit.g,    isFraction: false },
    [NutrientName.Water]:               { unit: NutrientUnit.g,    isFraction: false },
    [NutrientName.Ash]:                 { unit: NutrientUnit.g,    isFraction: false },
    [NutrientName.Caffeine]:            { unit: NutrientUnit.mg,   isFraction: false },
};

const initialState: MetaStore = {
    isLoading: false,
    isLoaded: false,
    errorMessage: null,

    nutrientDescriptions: mapRecord(NUTRIENT_DESCRIPTIONS, (key, value) => ({ ...value, id: 0, type: key })),
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(fetchNutrients.pending, (state) => {
            state.isLoading = true;
            state.isLoaded = false;
            state.errorMessage = null;
            state.nutrientDescriptions = initialState.nutrientDescriptions;
        })
        .addCase(fetchNutrients.fulfilled, (state, { payload: nutrients }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = null;

            const nutrientDescriptions = nutrients.reduce((acc, nutrient) => ({
                ...acc,
                [nutrient.name]: {
                    id: nutrient.id,
                    type: nutrient.name,
                    unit: nutrient.unit,
                    dailyValue: nutrient.daily_value,
                    isFraction: isSome(nutrient.parent_name),
                },
            }), initialState.nutrientDescriptions);

            // TODO: Make it safer? Currently you just assume that database and list of nutrients here are in sync
            state.nutrientDescriptions = nutrientDescriptions;
        })
        .addCase(fetchNutrients.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.nutrientDescriptions = initialState.nutrientDescriptions;
        });
});


export default reducer;
