import React from "react";
import { useDispatch } from "react-redux";

import type { IngredientItem, InputChangeCallback } from "@common/typings";
import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredientDefault } from "@store/recipe/types";

import styles from "./IngredientsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredient: RecipeIngredientDefault;
    references: Dictionary<string, IngredientItem>;
    isNew?: boolean;
}

const IngredientInfoLine: React.FC<Props> = ({ ingredient, references, isReadOnly, isNew = false }) => {

    const dispatch = useDispatch();

    const ingredientItemName = Utils.unwrap(references[ingredient.id]?.name, "NEW INGREDIENT");

    const handleIngredientAmountEdit = (id: string): InputChangeCallback => {
        return (event) => {
            dispatch(actions.updateIngredientAmount(id, event.target.value));
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
                onChange={(value: WeightUnit | VolumeUnit) => {
                    dispatch(actions.updateIngredientUnit(ingredient.id, value));
                }}
            />
        </div>
    );

    return (
        <div
            key={(isNew ? "NEW INGREDIENT" : ingredientItemName)}
            className={Utils.classNames({ [styles.ingredientInfoLine]: true, [styles.newIngredient]: isNew })}
        >

            <div
                className={styles.ingredientInfoLineName}
                style={( ingredient.isMarked ? { opacity: 0.25 } : undefined )}
                onClick={() => dispatch(actions.toggleIngredientOpen(ingredient.id))}
            >
                {( isNew ? "NEW INGREDIENT" : ingredientItemName.toUpperCase() )}
            </div>

            {( !isNew && measureInput )}
        </div>
    );
};

IngredientInfoLine.displayName = "IngredientInfoLine";


export default IngredientInfoLine;
