import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { COLOR_WHITE } from "@common/colors";
import type { InputChangeCallback } from "@common/typings";
import { Units, WeightUnit } from "@common/units";
import Utils, { ProductType } from "@common/utils";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeIngredientProduct } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import LinkIcon from "@icons/link-sharp.svg";

import styles from "./rba-ingredient-product.module.scss";


interface Props {
    isReadOnly: boolean;
    ingredientProduct: RecipeIngredientProduct;
    onClick: () => void;
    onClickRemove: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onChangeAmount: InputChangeCallback;
    onChangeUnit: RbaSelectChangeCallback;
}

// TODO: Remove, there shouldn't be a need for it
export const DEFAULT_INGREDIENT_PRODUCT: RecipeIngredientProduct = {
    product_id: -1,
    product_type: ProductType.Food,
    name: "NEW INGREDIENT",
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
    nutrition_facts: {},
};


const RbaIngredientProduct: React.FC<Props> = ({
    isReadOnly,
    ingredientProduct,
    onClick,
    onClickRemove,
    onMouseEnter,
    onMouseLeave,
    onChangeAmount,
    onChangeUnit,
}) => {

    const removeButton = (
        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT_REMOVE_BUTTON}
            className={styles.ingredientProductButtonLeft}
            onClick={onClickRemove}
        >
            <RbaIconWrapper isFullWidth={true} width={24} height={24} color={COLOR_WHITE}>
                <RemoveIcon />
            </RbaIconWrapper>
        </div>
    );

    const amountText = (
        <div className={styles.ingredientInfoLineAmountText}>
            {ingredientProduct.amount}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoLineAmountInput}
            value={(ingredientProduct.amountInput|| "")}
            onChange={onChangeAmount}
        />
    );

    return (

        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT}
            className={[ styles.ingredientProduct, styles.theme_Alternative ].join(" ")}
        >
            {( !isReadOnly && removeButton )}

            <div className={styles.ingredientProductInfo}>
                {/* FIXME: Whole line should be clickable, but it shouldn't mess with amount and unit */}
                <div
                    data-cy={constants.CY_INGREDIENT_PRODUCT_INFO_NAME}
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
                        theme={SelectTheme.Alternative}
                        center={true}
                        width={SelectWidthSize.Medium}
                        height={SelectHeightSize.Medium}
                        options={Object.values(Units).map((unit) => ({ value: unit }))}
                        value={ingredientProduct.unit}
                        onChange={onChangeUnit}
                    />
                </div>
            </div>

            <Link href={Utils.getItemPath(ingredientProduct.product_type, ingredientProduct.product_id)}>
                <a className={styles.ingredientProductButtonRight}>
                    <RbaIconWrapper isFullWidth={true} width={24} height={24} color={COLOR_WHITE}>
                        <LinkIcon />
                    </RbaIconWrapper>
                </a>
            </Link>
        </div>
    );
};

RbaIngredientProduct.displayName = "RbaIngredientProduct";


export default RbaIngredientProduct;
