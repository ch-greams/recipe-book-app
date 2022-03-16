import React from "react";
import { useDispatch } from "react-redux";

import type { InputChangeCallback } from "@common/typings";
import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient, RecipeIngredientProduct } from "@store/recipe/types";

import { DEFAULT_INGREDIENT_PRODUCT } from "./AltIngredientLine";

import styles from "./IngredientsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredient: RecipeIngredient;
    isNew?: boolean;
}

const IngredientInfoLine: React.FC<Props> = ({ ingredient, isReadOnly, isNew = false }) => {

    const dispatch = useDispatch();

    const ingredientProduct: RecipeIngredientProduct = Utils.unwrap(
        ingredient.products[ingredient.product_id], DEFAULT_INGREDIENT_PRODUCT,
    );

    const handleIngredientAmountEdit = (id: number): InputChangeCallback => {
        return (event) => {
            dispatch(actions.updateIngredientAmount(id, event.target.value));
        };
    };

    const amountText = (
        <div className={styles.ingredientInfoLineAmountText}>
            {ingredientProduct.amount}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoLineAmountInput}
            value={(ingredientProduct.amountInput || "")}
            onChange={handleIngredientAmountEdit(ingredient.id)}
        />
    );

    const measureInput = (
        <div className={styles.ingredientInfoLineMeasure}>
                
            {( isReadOnly ? amountText : amountInput )}
            
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.values(Units).map((unit) => ({ value: unit }))}
                value={ingredientProduct.unit}
                onChange={(value: WeightUnit | VolumeUnit) => {
                    dispatch(actions.updateIngredientUnit(ingredient.id, value));
                }}
            />
        </div>
    );

    return (
        <div
            key={(isNew ? "NEW INGREDIENT" : ingredientProduct.name)}
            className={Utils.classNames({ [styles.ingredientInfoLine]: true, [styles.newIngredient]: isNew })}
        >

            <div
                className={styles.ingredientInfoLineName}
                style={( ingredient.isMarked ? { opacity: 0.25 } : undefined )}
                onClick={() => dispatch(actions.toggleIngredientOpen(ingredient.id))}
            >
                {( isNew ? "NEW INGREDIENT" : ingredientProduct.name.toUpperCase() )}
            </div>

            {( !isNew && measureInput )}
        </div>
    );
};

IngredientInfoLine.displayName = "IngredientInfoLine";


export default IngredientInfoLine;
