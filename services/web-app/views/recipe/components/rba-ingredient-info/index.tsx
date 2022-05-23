import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { COLOR_DEFAULT } from "@common/colors";
import type { InputChangeCallback } from "@common/typings";
import { Units } from "@common/units";
import Utils, { ProductType } from "@common/utils";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeIngredientProduct } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import LinkIcon from "@icons/link-sharp.svg";

import styles from "./rba-ingredient-info.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredientProduct: RecipeIngredientProduct;
    isMarked?: boolean;
    onClick: () => void;
    onClickRemove: () => void;
    onClickMark?: () => void;
    onChangeAmount: InputChangeCallback;
    onChangeUnit: RbaSelectChangeCallback;
}

const getCheckbox = (isMarked?: boolean, onClickMark?: Option<() => void>): Option<JSX.Element> => (
    Utils.isSome(onClickMark)
        ? (
            <div className={styles.ingredientCheckbox} onClick={onClickMark}>
                {( isMarked ? <div className={styles.ingredientCheckboxMark} /> : null )}
            </div>
        )
        : null
);

const RbaIngredientInfo: React.FC<Props> = ({
    ingredientProduct, isReadOnly, isMarked, onClick, onClickRemove, onClickMark, onChangeAmount, onChangeUnit,
}) => {

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
            onChange={onChangeAmount}
        />
    );

    const removeButton = (
        <div
            data-cy={constants.CY_INGREDIENT_REMOVE_BUTTON}
            className={styles.ingredientButton}
            onClick={onClickRemove}
        >
            <RbaIconWrapper width={44} height={24} color={COLOR_DEFAULT}>
                <RemoveIcon />
            </RbaIconWrapper>
        </div>
    );

    const linkPath = Utils.getItemPath(
        Utils.unwrapOr(ingredientProduct.product_type, ProductType.Food),
        ingredientProduct.product_id,
    );

    return (
        <div className={styles.ingredient}>

            {( isReadOnly ? getCheckbox(isMarked, onClickMark) : removeButton )}

            <div
                data-cy={constants.CY_INGREDIENT_INFO_LINE}
                key={ingredientProduct.name}
                className={styles.ingredientInfo}
            >
                {/* FIXME: Whole line should be clickable, but it shouldn't mess with amount and unit */}
                <div
                    data-cy={constants.CY_INGREDIENT_INFO_LINE_NAME}
                    className={styles.ingredientInfoName}
                    style={( isMarked ? { opacity: 0.25 } : undefined )}
                    onClick={onClick}
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
                        onChange={onChangeUnit}
                    />
                </div>
            </div>

            <Link href={linkPath}>
                <a className={styles.ingredientButton}>
                    <RbaIconWrapper width={44} height={24} color={COLOR_DEFAULT}>
                        <LinkIcon />
                    </RbaIconWrapper>
                </a>
            </Link>

        </div>
    );
};

RbaIngredientInfo.displayName = "RbaIngredientInfo";


export default RbaIngredientInfo;
