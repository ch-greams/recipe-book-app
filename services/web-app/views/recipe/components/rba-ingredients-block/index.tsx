import React from "react";
import { useDispatch } from "react-redux";

import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { addIngredientRequest } from "@store/recipe/actions";
import type { RecipeIngredient } from "@store/recipe/types";
import { searchClear, searchProducts } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import RbaIngredient from "../rba-ingredient";


interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    search: SearchPageStore;
}



const RbaIngredientsBlock: React.FC<Props> = ({ search, ingredients, isReadOnly = false }) => {

    const dispatch = useDispatch();

    return (
        <div>
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
