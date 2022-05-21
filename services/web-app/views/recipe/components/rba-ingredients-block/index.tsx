import React from "react";

import type { RecipeIngredient } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";

import RbaIngredient from "../rba-ingredient";


interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    search: SearchPageStore;
}



const RbaIngredientsBlock: React.FC<Props> = ({ search, ingredients, isReadOnly = false }) => {

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
                <RbaIngredient
                    key={"ingredient_new"}
                    search={search}
                    isReadOnly={isReadOnly}
                    isNew={true}
                />
            ) )}
        </div>
    );
};

RbaIngredientsBlock.displayName = "RbaIngredientsBlock";


export default RbaIngredientsBlock;
