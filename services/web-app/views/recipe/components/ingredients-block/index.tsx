import React from "react";

import type { RecipeIngredient } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";

import IngredientLine from "./ingredient-line";

import styles from "./ingredients-block.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    search: SearchPageStore;
}



const IngredientsBlock: React.FC<Props> = ({ search, ingredients, isReadOnly = false }) => {

    return (
        <div className={styles.ingredientsBlock}>

            {ingredients.map( (ingredient) => (
                <IngredientLine
                    key={`ingredient_${ingredient.id}`}
                    search={search}
                    isReadOnly={isReadOnly}
                    ingredient={ingredient}
                />
            ) )}

            {( !isReadOnly && (
                <IngredientLine
                    key={"ingredient_new"}
                    search={search}
                    isReadOnly={isReadOnly}
                    isNew={true}
                />
            ) )}

        </div>
    );
};

IngredientsBlock.displayName = "IngredientsBlock";


export default IngredientsBlock;
