import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import type { VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaIngredientNutritionFacts from "@views/recipe/components/rba-ingredient-nutrition-facts";
import RbaIngredientProduct, {
    IngredientProductSize, IngredientProductTheme,
} from "@views/recipe/components/rba-ingredient-product";
import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from "@views/shared/rba-search-input";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient, RecipeIngredientProduct } from "@store/recipe/types";
import { searchClear, searchProducts } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import styles from "./rba-ingredient.module.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    ingredient: RecipeIngredient;
}


const RbaIngredient: React.FC<Props> = ({ search, isReadOnly, ingredient }) => {

    const dispatch = useDispatch();

    const showIngredientProducts: boolean = ingredient.isOpen && Utils.arrayIsNotEmpty(Object.keys(ingredient.products));
    const showNewIngredientProduct: boolean = ingredient.isOpen && !isReadOnly;

    const showSeparator: boolean = showIngredientProducts || showNewIngredientProduct;

    const ingredientProduct: RecipeIngredientProduct = Utils.getRecipeIngredientProduct(ingredient);

    return (

        <div
            data-cy={constants.CY_INGREDIENT}
            key={`ingredient_${ingredient.id}`}
            className={styles.ingredient}
        >
            <RbaIngredientProduct
                theme={IngredientProductTheme.Primary}
                size={IngredientProductSize.Default}
                ingredientProduct={ingredientProduct}
                isReadOnly={isReadOnly}
                isMarked={ingredient.isMarked}
                onClick={() => dispatch(actions.toggleIngredientOpen(ingredient.id))}
                onClickRemove={() => dispatch(actions.removeIngredient(ingredient.id))}
                onClickMark={() => dispatch(actions.toggleIngredientMark(ingredient.id))}
                onChangeAmount={(event) => {
                    dispatch(actions.updateIngredientProductAmount(ingredient.id, ingredient.product_id, event.target.value));
                }}
                onChangeUnit={(option) => {
                    dispatch(actions.updateIngredientProductUnit(
                        ingredient.id, ingredient.product_id, option.value as WeightUnit | VolumeUnit,
                    ));
                }}
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
                    Utils.getObjectValues(ingredient.products).map((product) => (
                        <RbaIngredientProduct
                            key={`ingredient_product_${product.product_id}`}
                            theme={IngredientProductTheme.Alternative}
                            size={IngredientProductSize.Compact}
                            isReadOnly={isReadOnly}
                            ingredientProduct={product}
                            onClick={() => {
                                dispatch(actions.replaceIngredientWithAlternative(ingredient.id, product.product_id));
                            }}
                            onClickRemove={() => {
                                dispatch(actions.removeIngredientProduct(ingredient.id, product.product_id));
                            }}
                            onMouseEnter={() => {
                                dispatch(actions.updateAltNutritionFacts(ingredient.id, product.product_id, true));
                            }}
                            onMouseLeave={() => {
                                dispatch(actions.updateAltNutritionFacts(ingredient.id, product.product_id, false));
                            }}
                            onChangeAmount={(event) => {
                                dispatch(actions.updateIngredientProductAmount(
                                    ingredient.id, product.product_id, event.target.value,
                                ));
                            }}
                            onChangeUnit={(option) => {
                                dispatch(actions.updateIngredientProductUnit(
                                    ingredient.id, product.product_id, option.value as WeightUnit | VolumeUnit,
                                ));
                            }}
                        />
                    ))
                )}

                {( showNewIngredientProduct && (
                    <RbaSearchInput
                        width={SearchInputWidthSize.Full}
                        height={SearchInputHeightSize.Small}
                        placeholder={"Add a substitute for this ingredient..."}
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
