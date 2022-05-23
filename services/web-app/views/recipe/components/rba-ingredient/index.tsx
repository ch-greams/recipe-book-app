import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import type { InputChangeCallback } from "@common/typings";
import type { VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaIngredientInfo from "@views/recipe/components/rba-ingredient-info";
import RbaIngredientNutritionFacts from "@views/recipe/components/rba-ingredient-nutrition-facts";
import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from "@views/shared/rba-search-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient, RecipeIngredientProduct } from "@store/recipe/types";
import { searchClear, searchProducts } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import RbaIngredientProduct from "../rba-ingredient-product";

import styles from "./rba-ingredient.module.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    ingredient?: RecipeIngredient;
}

const DEFAULT_INGREDIENT: RecipeIngredient = {
    isOpen: false,
    isMarked: false,
    id: -1,
    product_id: -1,
    alternativeNutritionFacts: {},
    products: {},
};


const RbaIngredient: React.FC<Props> = ({ search, isReadOnly, ingredient = DEFAULT_INGREDIENT }) => {

    const dispatch = useDispatch();

    const showIngredientProducts: boolean = ingredient.isOpen && Utils.arrayIsNotEmpty(Object.keys(ingredient.products));
    const showNewIngredientProduct: boolean = ingredient.isOpen && !isReadOnly;

    const showSeparator: boolean = showIngredientProducts || showNewIngredientProduct;

    // -------------------------------------------------------------------------

    const ingredientProduct: RecipeIngredientProduct = Utils.unwrap(
        ingredient.products[ingredient.product_id], `ingredient.products[${ingredient.product_id}]`,
    );

    const onClickIngredientInfo = (): void => { dispatch(actions.toggleIngredientOpen(ingredient.id)); };
    const onClickMarkIngredientInfo = (): void => { dispatch(actions.toggleIngredientMark(ingredient.id)); };

    const onClickRemoveIngredientInfo = (): void => {
        dispatch(actions.removeIngredientProduct(ingredient.id, ingredient.product_id));
    };
    const onChangeAmountIngredientInfo: InputChangeCallback = (event) => {
        dispatch(actions.updateIngredientProductAmount(ingredient.id, ingredient.product_id, event.target.value));
    };
    const onChangeUnitIngredientInfo: RbaSelectChangeCallback = (option) => {
        dispatch(actions.updateIngredientProductUnit(
            ingredient.id, ingredient.product_id, option.value as WeightUnit | VolumeUnit,
        ));
    };

    return (

        <div
            data-cy={constants.CY_INGREDIENT}
            key={`ingredient_${ingredient.id}`}
            className={styles.ingredient}
        >
            <RbaIngredientInfo
                ingredientProduct={ingredientProduct}
                isReadOnly={isReadOnly}
                isMarked={ingredient.isMarked}
                onClick={onClickIngredientInfo}
                onClickRemove={onClickRemoveIngredientInfo}
                onClickMark={onClickMarkIngredientInfo}
                onChangeAmount={onChangeAmountIngredientInfo}
                onChangeUnit={onChangeUnitIngredientInfo}
            />

            <div className={styles.ingredientInfoLines}>

                {(
                    ingredient.isOpen && (
                        <RbaIngredientNutritionFacts
                            nutritionFacts={ingredientProduct.nutrition_facts}
                            alternativeNutritionFacts={ingredient.alternativeNutritionFacts}
                        />
                    )
                )}

                {( showSeparator && (<div className={styles.separator}></div>) )}

                {(
                    showIngredientProducts &&
                    Utils.getObjectValues(ingredient.products).map((product) => {

                        const onClickIngredientProduct = (): void => {
                            dispatch(actions.replaceIngredientWithAlternative(ingredient.id, product.product_id));
                        };
                        const onMouseEnterIngredientProduct = (): void => {
                            dispatch(actions.updateAltNutritionFacts(ingredient.id, product.product_id, true));
                        };
                        const onMouseLeaveIngredientProduct = (): void => {
                            dispatch(actions.updateAltNutritionFacts(ingredient.id, product.product_id, false));
                        };

                        const onClickRemoveIngredientProduct = (): void => {
                            dispatch(actions.removeIngredientProduct(ingredient.id, product.product_id));
                        };
                        const onChangeAmountIngredientProduct: InputChangeCallback = (event) => {
                            dispatch(actions.updateIngredientProductAmount(ingredient.id, product.product_id, event.target.value));
                        };
                        const onChangeUnitIngredientProduct: RbaSelectChangeCallback = (option) => {
                            dispatch(actions.updateIngredientProductUnit(
                                ingredient.id, product.product_id, option.value as WeightUnit | VolumeUnit,
                            ));
                        };

                        return (
                            <RbaIngredientProduct
                                key={`ingredient_product_${product.product_id}`}
                                isReadOnly={isReadOnly}
                                ingredientProduct={product}
                                onClick={onClickIngredientProduct}
                                onClickRemove={onClickRemoveIngredientProduct}
                                onMouseEnter={onMouseEnterIngredientProduct}
                                onMouseLeave={onMouseLeaveIngredientProduct}
                                onChangeAmount={onChangeAmountIngredientProduct}
                                onChangeUnit={onChangeUnitIngredientProduct}
                            />
                        );
                    })
                )}

                {( showNewIngredientProduct && (
                    <RbaSearchInput
                        width={SearchInputWidthSize.Full}
                        height={SearchInputHeightSize.Small}
                        isLoading={!search.isLoaded}
                        value={search.searchInput}
                        items={search.products}
                        onChange={(value) => { dispatch(searchProducts(value)); }}
                        onSelect={(product) => {
                            dispatch(actions.addIngredientProductRequest(ingredient.id, product));
                            dispatch(searchClear());
                        }}
                    />
                ) )}

            </div>
        </div>
    );
};

RbaIngredient.displayName = "RbaIngredient";


export default RbaIngredient;
