import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import type { VolumeUnit } from "@common/units";
import { Units, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredientProduct } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import SearchIcon from "@icons/search-sharp.svg";

import styles from "./rba-ingredients-block.module.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    parentId: number;
    ingredientProduct?: RecipeIngredientProduct;
    isNew?: boolean;
}

export const DEFAULT_INGREDIENT_PRODUCT: RecipeIngredientProduct = {
    product_id: -1,
    product_type: "food",
    name: "NEW INGREDIENT",
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
    nutrition_facts: {},
};


const RbaIngredientProductLine: React.FC<Props> = ({
    search, isReadOnly, parentId, ingredientProduct = DEFAULT_INGREDIENT_PRODUCT, isNew = false,
}) => {

    const dispatch = useDispatch();

    // FIXME: Replace functionality
    const addIngredientProduct = (id: number): void => {
        const item = search.products[Math.floor(Math.random() * search.products.length)];
        console.log("PLEASE FIX ME:", id, item);
        // dispatch(actions.addAltIngredient(id, item));
    };

    const removeButton = (
        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT_LINE_REMOVE_BUTTON}
            className={styles.ingredientProductLineButton}
            onClick={() => dispatch(actions.removeIngredientProduct(parentId, ingredientProduct.product_id))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const searchButton = (
        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT_LINE_SEARCH_BUTTON}
            className={styles.ingredientProductLineButton}
            onClick={() => addIngredientProduct(parentId)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <SearchIcon />
            </IconWrapper>
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
            onChange={(event) => {
                dispatch(actions.updateIngredientProductAmount(parentId, ingredientProduct.product_id, event.target.value));
            }}
        />
    );

    const measureInput = (

        <div className={styles.ingredientInfoLineMeasure}>

            {( isReadOnly ? amountText : amountInput )}

            <RbaSelect
                theme={SelectTheme.Alternative}
                center={true}
                width={SelectWidthSize.Medium}
                height={SelectHeightSize.Medium}
                options={Object.values(Units).map((unit) => ({ value: unit }))}
                value={ingredientProduct.unit}
                onChange={(option: SelectOption) => {
                    dispatch(actions.updateIngredientProductUnit(
                        parentId, ingredientProduct.product_id, option.value as WeightUnit | VolumeUnit,
                    ));
                }}
            />
        </div>
    );

    const onClick = (): void => { dispatch(actions.replaceIngredientWithAlternative(parentId, ingredientProduct.product_id)); };
    const onMouseEnter = (): void => { dispatch(actions.updateAltNutritionFacts(parentId, ingredientProduct.product_id, true)); };
    const onMouseLeave = (): void => { dispatch(actions.updateAltNutritionFacts(parentId, ingredientProduct.product_id, false)); };

    return (

        <div
            data-cy={constants.CY_INGREDIENT_PRODUCT_LINE}
            className={styles.ingredientProductLine}
        >

            {( !isReadOnly && ( isNew ? searchButton : removeButton ) )}

            <div className={Utils.classNames({
                [styles.ingredientProductInfoLine]: true,
                [styles.newIngredient]: isNew,
            })}>

                <div
                    data-cy={constants.CY_INGREDIENT_PRODUCT_INFO_LINE_NAME}
                    className={styles.ingredientInfoLineName}
                    onClick={isNew ? undefined : onClick}
                    onMouseEnter={isNew ? undefined : onMouseEnter}
                    onMouseLeave={isNew ? undefined : onMouseLeave}
                >
                    {isNew ? "NEW ALTERNATIVE" : ingredientProduct.name.toUpperCase()}
                </div>

                {( !isNew && measureInput )}
            </div>
        </div>
    );
};

RbaIngredientProductLine.displayName = "RbaIngredientProductLine";


export default RbaIngredientProductLine;
