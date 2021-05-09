import React from "react";
import { useDispatch } from "react-redux";

import type { Dictionary, IngredientItem, InputChangeCallback, Option, SelectChangeCallback } from "@common/typings";
import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import * as actions from "@client/store/recipe/actions";
import { RecipeIngredientDefault } from "@client/store/recipe/types";

import styles from "./IngredientsBlock.scss";



interface Props {
    isReadOnly: boolean;
    ingredient: RecipeIngredientDefault;
    references: Dictionary<string, IngredientItem>;
    isNew?: boolean;
}

const IngredientInfoLine: React.FC<Props> = ({ ingredient, references, isReadOnly, isNew = false }) => {

    const dispatch = useDispatch();

    const ingredientItem: Option<IngredientItem> = references[ingredient.id];

    const handleIngredientAmountEdit = (id: string): InputChangeCallback => {
        return (event) => {
            dispatch(actions.updateIngredientAmount(id, event.target.value));
        };
    };

    const handleIngredientUnitEdit = (id: string): SelectChangeCallback => {
        return (event) => {
            dispatch(actions.updateIngredientUnit(id, event.target.value as WeightUnit | VolumeUnit));
        };
    };

    const amountText = (
        <div className={styles.ingredientInfoLineAmountText}>
            {ingredient.amount}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoLineAmountInput}
            value={(ingredient.amountInput || "")}
            onChange={handleIngredientAmountEdit(ingredient.id)}
        />
    );

    const measureInput = (
        <div className={styles.ingredientInfoLineMeasure}>
                
            {( isReadOnly ? amountText : amountInput )}
            
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.values(Units).map((unit) => ({ value: unit }))}
                value={ingredient.unit}
                onChange={handleIngredientUnitEdit(ingredient.id)}
            />
        </div>
    );

    return (
        <div
            key={(isNew ? "NEW" : ingredientItem.name)}
            className={Utils.classNames({ [styles.ingredientInfoLine]: true, [styles.newIngredient]: isNew })}
        >

            <div
                className={styles.ingredientInfoLineName}
                style={( ingredient.isMarked ? { opacity: 0.25 } : undefined )}
                onClick={() => dispatch(actions.toggleIngredientOpen(ingredient.id))}
            >
                {( isNew ? "NEW INGREDIENT" : ingredientItem.name.toUpperCase() )}
            </div>

            {( !isNew && measureInput )}
        </div>
    );
};

IngredientInfoLine.displayName = "IngredientInfoLine";


export default IngredientInfoLine;
