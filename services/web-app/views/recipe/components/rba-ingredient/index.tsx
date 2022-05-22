import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import Utils from "@common/utils";
import RbaIngredientInfo from "@views/recipe/components/rba-ingredient-info";
import RbaIngredientNutritionFacts from "@views/recipe/components/rba-ingredient-nutrition-facts";
import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from "@views/shared/rba-search-input";
import { addIngredientProductRequest } from "@store/recipe/actions";
import type { RecipeIngredient } from "@store/recipe/types";
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

    return (

        <div
            data-cy={constants.CY_INGREDIENT}
            key={`ingredient_${ingredient.id}`}
            className={styles.ingredient}
        >
            <RbaIngredientInfo
                isReadOnly={isReadOnly}
                ingredient={ingredient}
            />

            <div className={styles.ingredientInfoLines}>

                {(
                    ingredient.isOpen && (
                        <RbaIngredientNutritionFacts
                            nutritionFacts={Utils.unwrapForced(
                                ingredient.products[ingredient.product_id],
                                `ingredient.products["${ingredient.product_id}"]`,
                            ).nutrition_facts}
                            alternativeNutritionFacts={ingredient.alternativeNutritionFacts}
                        />
                    )
                )}

                {( showSeparator && (<div className={styles.separator}></div>) )}

                {(
                    showIngredientProducts &&
                    Utils.getObjectValues(ingredient.products).map((product) => (
                        <RbaIngredientProduct
                            key={`ingredient_product_${product.product_id}`}
                            isReadOnly={isReadOnly}
                            parentId={ingredient.id}
                            ingredientProduct={product}
                        />
                    ))
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
                            dispatch(addIngredientProductRequest(ingredient.id, product));
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
