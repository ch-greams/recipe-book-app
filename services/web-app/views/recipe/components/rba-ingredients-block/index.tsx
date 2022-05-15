import React from "react";

import type { RecipeIngredient } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";

import RbaIngredientLine from "./rba-ingredient-line";

import styles from "./rba-ingredients-block.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    search: SearchPageStore;
}



const RbaIngredientsBlock: React.FC<Props> = ({ search, ingredients, isReadOnly = false }) => {

    return (
        <div className={styles.ingredientsBlock}>

            {ingredients.map( (ingredient) => (
                <RbaIngredientLine
                    key={`ingredient_${ingredient.id}`}
                    search={search}
                    isReadOnly={isReadOnly}
                    ingredient={ingredient}
                />
            ) )}

            {( !isReadOnly && (
                <RbaIngredientLine
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
