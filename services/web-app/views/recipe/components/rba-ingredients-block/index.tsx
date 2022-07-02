import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import RbaIngredient from "@views/recipe/components/rba-ingredient";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { addIngredientRequest } from "@store/recipe/actions";
import type { RecipeIngredient } from "@store/recipe/types";
import { searchClear, searchProducts } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";


interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    search: SearchPageStore;
}



const RbaIngredientsBlock: React.FC<Props> = ({ search, ingredients, isReadOnly = false }) => {

    const dispatch = useDispatch();

    return (
        <div data-cy={constants.CY_INGREDIENTS_BLOCK}>
            {ingredients.map( (ingredient) => (
                <RbaIngredient
                    key={`ingredient_${ingredient.id}`}
                    search={search}
                    isReadOnly={isReadOnly}
                    ingredient={ingredient}
                />
            ) )}

            {( !isReadOnly && (
                <RbaSearchInput
                    width={SearchInputWidthSize.Full}
                    placeholder={"Add an ingredient..."}
                    isLoading={!search.isLoaded}
                    value={search.searchInput}
                    items={search.products}
                    onChange={(value) => { dispatch(searchProducts(value)); }}
                    onSelect={(product) => {
                        dispatch(addIngredientRequest(product));
                        dispatch(searchClear());
                    }}
                />
            ) )}

        </div>
    );
};

RbaIngredientsBlock.displayName = "RbaIngredientsBlock";


export default RbaIngredientsBlock;
