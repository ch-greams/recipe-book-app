import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { getFoodPath } from "@common/routes";
import { classNames, Color } from "@common/style";
import { isSome } from "@common/types";
import { Unit } from "@common/units";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeIngredient } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconLink from "@icons/rba-icon-link";
import RbaIconRemove from "@icons/rba-icon-remove";

import styles from "./rba-ingredient-food.module.scss";


// NOTE: Values correspond to the class names
export enum IngredientFoodTheme {
    Primary = "theme_Primary",
    Alternative = "theme_Alternative",
}

export enum IngredientFoodSize {
    Compact = "size_Compact",
    Default = "size_Default",
}


interface Props {
    theme: IngredientFoodTheme;
    size: IngredientFoodSize;
    isReadOnly: boolean;
    ingredient: RecipeIngredient;
    onClick: () => void;
    onClickRemove: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onChangeAmount: RbaInputChangeCallback;
    onChangeUnit: RbaSelectChangeCallback;
    isMarked?: boolean;
    onClickMark?: () => void;
}


const getCheckbox = (isMarked?: boolean, onClickMark?: Option<() => void>): Option<JSX.Element> => (
    isSome(onClickMark)
        ? (
            <div className={styles.ingredientCheckbox} onClick={onClickMark}>
                {( isMarked ? <div className={styles.ingredientCheckboxMark} /> : null )}
            </div>
        )
        : null
);

const getSelectTheme = (theme: IngredientFoodTheme): SelectTheme => {
    switch (theme) {
        case IngredientFoodTheme.Primary:
            return SelectTheme.Primary;
        case IngredientFoodTheme.Alternative:
            return SelectTheme.Alternative;
    }
};

const getInputTheme = (theme: IngredientFoodTheme): InputTheme => {
    switch (theme) {
        case IngredientFoodTheme.Primary:
            return InputTheme.Primary;
        case IngredientFoodTheme.Alternative:
            return InputTheme.Alternative;
    }
};

const getIconColor = (theme: IngredientFoodTheme): Color => {
    switch (theme) {
        case IngredientFoodTheme.Primary:
            return Color.Default;
        case IngredientFoodTheme.Alternative:
            return Color.White;
    }
};

const RbaIngredientFood: React.FC<Props> = ({
    theme,
    size,
    isReadOnly,
    ingredient,
    onClick,
    onClickRemove,
    onMouseEnter,
    onMouseLeave,
    onChangeAmount,
    onChangeUnit,
    isMarked,
    onClickMark,
}) => {

    const removeButton = (
        <div
            data-cy={constants.CY_INGREDIENT_FOOD_REMOVE_BUTTON}
            className={styles.ingredientFoodButton}
            onClick={onClickRemove}
        >
            <RbaIconRemove size={IconSize.Medium} color={getIconColor(theme)} />
        </div>
    );

    return (

        <div
            data-cy={constants.CY_INGREDIENT_FOOD}
            className={classNames([ styles.ingredientFood, styles[theme], styles[size] ])}
        >
            {( isReadOnly ? getCheckbox(isMarked, onClickMark) : removeButton )}

            <div className={styles.ingredientFoodInfo}>
                {/* FIXME: Whole line should be clickable, but it shouldn't mess with amount and unit */}
                <div
                    data-cy={constants.CY_INGREDIENT_FOOD_NAME}
                    className={styles.ingredientInfoLineName}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {ingredient.name}
                </div>

                <div className={styles.ingredientInfoLineMeasure}>

                    <RbaInput
                        data-cy={constants.CY_INGREDIENT_FOOD_AMOUNT}
                        theme={getInputTheme(theme)}
                        width={InputWidthSize.Medium}
                        height={InputHeightSize.Medium}
                        disabled={isReadOnly}
                        value={ingredient.amountInput}
                        normalizer={InputNormalizer.Decimal}
                        onChange={onChangeAmount}
                    />

                    <RbaSelect
                        data-cy={constants.CY_SELECT_INPUT}
                        theme={getSelectTheme(theme)}
                        center={true}
                        width={SelectWidthSize.Medium}
                        height={SelectHeightSize.Medium}
                        options={Object.values(Unit).map((unit) => ({ value: unit }))}
                        value={ingredient.unit}
                        onChange={onChangeUnit}
                    />
                </div>
            </div>

            <Link href={getFoodPath(ingredient.is_recipe, ingredient.food_id)}>
                <a className={styles.ingredientFoodButton}>
                    <RbaIconLink size={IconSize.Medium} color={getIconColor(theme)} />
                </a>
            </Link>
        </div>
    );
};

RbaIngredientFood.displayName = "RbaIngredientFood";


export default RbaIngredientFood;
