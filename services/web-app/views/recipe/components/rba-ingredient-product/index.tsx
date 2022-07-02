import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import { isSome } from "@common/types";
import type { InputChangeCallback } from "@common/typings";
import { Unit } from "@common/units";
import Utils from "@common/utils";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeIngredientProduct } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import LinkIcon from "@icons/link-sharp.svg";

import styles from "./rba-ingredient-product.module.scss";


// NOTE: Values correspond to the class names
export enum IngredientProductTheme {
    Primary = "theme_Primary",
    Alternative = "theme_Alternative",
}

export enum IngredientProductSize {
    Compact = "size_Compact",
    Default = "size_Default",
}


interface Props {
    theme: IngredientProductTheme;
    size: IngredientProductSize;
    isReadOnly: boolean;
    ingredientProduct: RecipeIngredientProduct;
    onClick: () => void;
    onClickRemove: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onChangeAmount: InputChangeCallback;
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

const getSelectTheme = (theme: IngredientProductTheme): SelectTheme => {
    switch (theme) {
        case IngredientProductTheme.Primary:
            return SelectTheme.Primary;
        case IngredientProductTheme.Alternative:
            return SelectTheme.Alternative;
    }
};

const getIconColor = (theme: IngredientProductTheme): Color => {
    switch (theme) {
        case IngredientProductTheme.Primary:
            return Color.Default;
        case IngredientProductTheme.Alternative:
            return Color.White;
    }
};

const RbaIngredientProduct: React.FC<Props> = ({
    theme,
    size,
    isReadOnly,
    ingredientProduct,
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
            data-cy={constants.CY_INGREDIENT_PRODUCT_REMOVE_BUTTON}
            className={styles.ingredientProductButton}
            onClick={onClickRemove}
        >
            <RbaIconWrapper isFullWidth={true} width={24} height={24} color={getIconColor(theme)}>
                <RemoveIcon />
            </RbaIconWrapper>
        </div>
    );

    const amountText = (
        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT_AMOUNT_TEXT}
            className={styles.ingredientInfoLineAmountText}
        >
            {ingredientProduct.amountInput}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoLineAmountInput}
            value={(ingredientProduct.amountInput || "")}
            onChange={onChangeAmount}
        />
    );

    return (

        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT}
            className={[ styles.ingredientProduct, styles[theme], styles[size] ].join(" ")}
        >
            {( isReadOnly ? getCheckbox(isMarked, onClickMark) : removeButton )}

            <div className={styles.ingredientProductInfo}>
                {/* FIXME: Whole line should be clickable, but it shouldn't mess with amount and unit */}
                <div
                    data-cy={constants.CY_INGREDIENT_PRODUCT_NAME}
                    className={styles.ingredientInfoLineName}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {ingredientProduct.name.toUpperCase()}
                </div>

                <div className={styles.ingredientInfoLineMeasure}>

                    {( isReadOnly ? amountText : amountInput )}

                    <RbaSelect
                        theme={getSelectTheme(theme)}
                        center={true}
                        width={SelectWidthSize.Medium}
                        height={SelectHeightSize.Medium}
                        options={Object.values(Unit).map((unit) => ({ value: unit }))}
                        value={ingredientProduct.unit}
                        onChange={onChangeUnit}
                    />
                </div>
            </div>

            <Link href={Utils.getProductPath(ingredientProduct.product_type, ingredientProduct.product_id)}>
                <a className={styles.ingredientProductButton}>
                    <RbaIconWrapper isFullWidth={true} width={24} height={24} color={getIconColor(theme)}>
                        <LinkIcon />
                    </RbaIconWrapper>
                </a>
            </Link>
        </div>
    );
};

RbaIngredientProduct.displayName = "RbaIngredientProduct";


export default RbaIngredientProduct;
