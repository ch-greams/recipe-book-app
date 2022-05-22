import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import * as constants from "@cypress/constants";

import type { InputChangeCallback } from "@common/typings";
import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import Utils, { ProductType } from "@common/utils";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient, RecipeIngredientProduct } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import LinkIcon from "@icons/link-sharp.svg";

import { DEFAULT_INGREDIENT_PRODUCT } from "../rba-ingredient-product";

import styles from "./rba-ingredient-info.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredient: RecipeIngredient;
}

const RbaIngredientInfo: React.FC<Props> = ({ ingredient, isReadOnly }) => {

    const dispatch = useDispatch();

    const removeIngredient = (id: number): void => { dispatch(actions.removeIngredient(id)); };
    const toggleIngredientMark = (id: number): void => { dispatch(actions.toggleIngredientMark(id)); };

    const ingredientProduct: RecipeIngredientProduct = Utils.unwrap(
        ingredient.products[ingredient.product_id], DEFAULT_INGREDIENT_PRODUCT,
    );

    const handleIngredientAmountEdit = (id: number): InputChangeCallback => {
        return (event) => {
            dispatch(actions.updateIngredientAmount(id, event.target.value));
        };
    };

    const amountText = (
        <div className={styles.ingredientInfoAmountText}>
            {ingredientProduct.amount}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoAmountInput}
            value={(ingredientProduct.amountInput || "")}
            onChange={handleIngredientAmountEdit(ingredient.id)}
        />
    );

    const checkbox = (
        <div
            className={styles.ingredientCheckbox}
            onClick={() => toggleIngredientMark(ingredient.id)}
        >
            {( ingredient.isMarked ? <div className={styles.ingredientCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            data-cy={constants.CY_INGREDIENT_REMOVE_BUTTON}
            className={styles.ingredientButton}
            onClick={() => removeIngredient(ingredient.id)}
        >
            <IconWrapper width={44} height={24} color={Utils.COLOR_DEFAULT}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const linkPath = Utils.getItemPath(
        Utils.unwrap(ingredient.products[ingredient.product_id]?.product_type, ProductType.Food),
        ingredient.product_id,
    );

    return (
        <div className={styles.ingredient}>

            {( isReadOnly ? checkbox : removeButton )}

            <div
                data-cy={constants.CY_INGREDIENT_INFO_LINE}
                key={ingredientProduct.name}
                className={styles.ingredientInfo}
            >
                {/* FIXME: Whole line should be clickable, but it shouldn't mess with amount and unit */}
                <div
                    data-cy={constants.CY_INGREDIENT_INFO_LINE_NAME}
                    className={styles.ingredientInfoName}
                    style={( ingredient.isMarked ? { opacity: 0.25 } : undefined )}
                    onClick={() => dispatch(actions.toggleIngredientOpen(ingredient.id))}
                >
                    {ingredientProduct.name.toUpperCase()}
                </div>

                <div className={styles.ingredientInfoMeasure}>

                    {( isReadOnly ? amountText : amountInput )}

                    <RbaSelect
                        theme={SelectTheme.Primary}
                        center={true}
                        width={SelectWidthSize.Medium}
                        height={SelectHeightSize.Medium}
                        options={Object.values(Units).map((unit) => ({ value: unit }))}
                        value={ingredientProduct.unit}
                        onChange={(option: SelectOption) => {
                            dispatch(actions.updateIngredientUnit(ingredient.id, option.value as WeightUnit | VolumeUnit));
                        }}
                    />
                </div>
            </div>

            <Link href={linkPath}>
                <a className={styles.ingredientButton}>
                    <IconWrapper width={44} height={24} color={Utils.COLOR_DEFAULT}>
                        <LinkIcon />
                    </IconWrapper>
                </a>
            </Link>

        </div>
    );
};

RbaIngredientInfo.displayName = "RbaIngredientInfo";


export default RbaIngredientInfo;
