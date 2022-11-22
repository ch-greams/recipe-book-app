import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { classNames, Color } from "@common/style";
import { isSome } from "@common/types";
import { Unit } from "@common/units";
import Utils from "@common/utils";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeIngredientProduct } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconLink from "@icons/rba-icon-link";
import RbaIconRemove from "@icons/rba-icon-remove";

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

const getSelectTheme = (theme: IngredientProductTheme): SelectTheme => {
    switch (theme) {
        case IngredientProductTheme.Primary:
            return SelectTheme.Primary;
        case IngredientProductTheme.Alternative:
            return SelectTheme.Alternative;
    }
};

const getInputTheme = (theme: IngredientProductTheme): InputTheme => {
    switch (theme) {
        case IngredientProductTheme.Primary:
            return InputTheme.Primary;
        case IngredientProductTheme.Alternative:
            return InputTheme.Alternative;
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
            <RbaIconRemove size={IconSize.Medium} color={getIconColor(theme)} />
        </div>
    );

    return (

        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT}
            className={classNames([ styles.ingredientProduct, styles[theme], styles[size] ])}
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
                    {ingredientProduct.name}
                </div>

                <div className={styles.ingredientInfoLineMeasure}>

                    <RbaInput
                        data-cy={constants.CY_INGREDIENT_PRODUCT_AMOUNT}
                        theme={getInputTheme(theme)}
                        width={InputWidthSize.Medium}
                        height={InputHeightSize.Medium}
                        disabled={isReadOnly}
                        value={ingredientProduct.amountInput}
                        normalizer={InputNormalizer.Decimal}
                        onChange={onChangeAmount}
                    />

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
                    <RbaIconLink size={IconSize.Medium} color={getIconColor(theme)} />
                </a>
            </Link>
        </div>
    );
};

RbaIngredientProduct.displayName = "RbaIngredientProduct";


export default RbaIngredientProduct;
