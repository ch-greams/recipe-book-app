import React from "react";
import * as constants from "@cypress/constants";

import type { Unit } from "@common/units";
import Utils from "@common/utils";
import RbaIngredientNutritionFacts from "@views/recipe/components/rba-ingredient-nutrition-facts";
import RbaIngredientProduct, {
    IngredientProductSize, IngredientProductTheme,
} from "@views/recipe/components/rba-ingredient-product";
import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import { searchClear, searchProducts } from "@store/actions/search";
import type { RecipeIngredient, RecipeIngredientProduct } from "@store/types/recipe";
import type { SearchPageStore } from "@store/types/search";

import styles from "./rba-ingredient.module.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    ingredient: RecipeIngredient;
}


const RbaIngredient: React.FC<Props> = ({ search, isReadOnly, ingredient }) => {

    const dispatch = useAppDispatch();

    const showIngredientProducts: boolean = Utils.arrayIsNotEmpty(Object.keys(ingredient.products));
    const showNewIngredientProduct: boolean = !isReadOnly;
    const showSeparator: boolean = showIngredientProducts || showNewIngredientProduct;

    const ingredientProduct: RecipeIngredientProduct = Utils.getRecipeIngredientProduct(ingredient);

    const ingredientInfoLines = (
        <div
            data-cy={constants.CY_INGREDIENT_INFO_LINES}
            className={styles.ingredientInfoLines}
        >

            <RbaIngredientNutritionFacts
                nutritionFacts={ingredientProduct.nutrition_facts}
                alternativeNutritionFacts={ingredient.alternativeNutritionFacts}
            />

            {( showSeparator && (<div className={styles.separator}></div>) )}

            {(
                showIngredientProducts && Utils.getObjectValues(ingredient.products).map((product) => (
                    <RbaIngredientProduct
                        key={`ingredient_product_${product.product_id}`}
                        theme={IngredientProductTheme.Alternative}
                        size={IngredientProductSize.Compact}
                        isReadOnly={isReadOnly}
                        ingredientProduct={product}
                        onClick={() => {
                            dispatch(actions.replaceIngredientWithAlternative({ parentId: ingredient.id, id: product.product_id }));
                        }}
                        onClickRemove={() => {
                            dispatch(actions.removeIngredientProduct({ parentId: ingredient.id, id: product.product_id }));
                        }}
                        onMouseEnter={() => {
                            dispatch(actions.updateAltNutritionFacts({ parentId: ingredient.id, id: product.product_id, isSelected: true }));
                        }}
                        onMouseLeave={() => {
                            dispatch(actions.updateAltNutritionFacts({ parentId: ingredient.id, id: product.product_id, isSelected: false }));
                        }}
                        onChangeAmount={(event) => {
                            dispatch(actions.updateIngredientProductAmount({
                                parentId: ingredient.id, id: product.product_id, inputValue: event.target.value,
                            }));
                        }}
                        onChangeUnit={(option) => {
                            dispatch(actions.updateIngredientProductUnit({
                                parentId: ingredient.id, id: product.product_id, unit: option.value as Unit,
                            }));
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
                        dispatch(actions.addIngredientProduct({ id: ingredient.id, product }));
                        dispatch(searchClear());
                    }}
                />
            ) )}

        </div>
    );

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
                    dispatch(actions.updateIngredientProductAmount({
                        parentId: ingredient.id, id: ingredient.product_id, inputValue: event.target.value,
                    }));
                }}
                onChangeUnit={(option) => {
                    dispatch(actions.updateIngredientProductUnit({
                        parentId: ingredient.id, id: ingredient.product_id, unit: option.value as Unit,
                    }));
                }}
            />

            {ingredient.isOpen && ingredientInfoLines}

        </div>
    );
};

RbaIngredient.displayName = "RbaIngredient";


export default RbaIngredient;
