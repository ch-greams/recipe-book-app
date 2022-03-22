import React from "react";
import { useDispatch } from "react-redux";

import type { VolumeUnit } from "@common/units";
import { Units, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import type { SelectOption } from "@views/shared/SelectInput";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredientProduct } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import SearchIcon from "@icons/search-sharp.svg";

import styles from "./IngredientsBlock.module.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    parentId: number;
    altIngredientProduct?: RecipeIngredientProduct;
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


const AltIngredientLine: React.FC<Props> = ({
    search, isReadOnly, parentId, altIngredientProduct = DEFAULT_INGREDIENT_PRODUCT, isNew = false,
}) => {

    const dispatch = useDispatch();

    const addAltIngredient = (id: number): void => {
        const item = search.ingredients[Math.floor(Math.random() * search.ingredients.length)];
        dispatch(actions.addAltIngredient(id, item));
    };

    const removeButton = (
        <div
            className={styles.altIngredientLineButton}
            onClick={() => dispatch(actions.removeAltIngredient(parentId, altIngredientProduct.product_id))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const searchButton = (
        <div
            className={styles.altIngredientLineButton}
            onClick={() => addAltIngredient(parentId)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <SearchIcon />
            </IconWrapper>
        </div>
    );

    const amountText = (
        <div className={styles.ingredientInfoLineAmountText}>
            {altIngredientProduct.amount}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoLineAmountInput}
            value={(altIngredientProduct.amountInput|| "")}
            onChange={(event) => {
                dispatch(actions.updateAltIngredientAmount(parentId, altIngredientProduct.product_id, event.target.value));
            }}
        />
    );

    const measureInput = (

        <div className={styles.ingredientInfoLineMeasure}>
                        
            {( isReadOnly ? amountText : amountInput )}
            
            <SelectInput
                type={SelectInputType.AltIngredientUnit}
                options={Object.values(Units).map((unit) => ({ value: unit }))}
                value={altIngredientProduct.unit}
                onChange={(option: SelectOption<WeightUnit | VolumeUnit>) => {
                    dispatch(actions.updateAltIngredientUnit(
                        parentId, altIngredientProduct.product_id, option.value,
                    ));
                }}
            />
        </div>
    );

    const onClick = (): void => { dispatch(actions.replaceIngredientWithAlternative(parentId, altIngredientProduct.product_id)); };
    const onMouseEnter = (): void => { dispatch(actions.updateAltNutritionFacts(parentId, altIngredientProduct.product_id, true)); };
    const onMouseLeave = (): void => { dispatch(actions.updateAltNutritionFacts(parentId, altIngredientProduct.product_id, false)); };

    return (

        <div className={styles.altIngredientLine}>

            {( !isReadOnly && ( isNew ? searchButton : removeButton ) )}

            <div className={Utils.classNames({
                [styles.altIngredientInfoLine]: true,
                [styles.newIngredient]: isNew,
            })}>

                <div
                    className={styles.ingredientInfoLineName}
                    onClick={isNew ? undefined : onClick}
                    onMouseEnter={isNew ? undefined : onMouseEnter}
                    onMouseLeave={isNew ? undefined : onMouseLeave}
                >
                    {isNew ? "NEW ALTERNATIVE" : altIngredientProduct.name.toUpperCase()}
                </div>

                {( !isNew && measureInput )}
            </div>
        </div>
    );
};

AltIngredientLine.displayName = "AltIngredientLine";


export default AltIngredientLine;
