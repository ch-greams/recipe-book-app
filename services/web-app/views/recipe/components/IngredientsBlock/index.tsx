import React from "react";
import type { RecipeIngredientDefault } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";

import type { Dictionary, IngredientItem } from "@common/typings";

import IngredientLine from "./IngredientLine";

import styles from "./IngredientsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredientDefault[];
    references: Dictionary<string, IngredientItem>;
    search: SearchPageStore;
}



const IngredientsBlock: React.FC<Props> = ({ search, references, ingredients, isReadOnly = false }) => {

    return (
        <div className={styles.ingredientsBlock}>

            {ingredients.map( (ingredient) => (
                <IngredientLine
                    key={`ingredient_${ingredient.id}`}
                    search={search}
                    isReadOnly={isReadOnly}
                    references={references}
                    ingredient={ingredient}
                />
            ) )}

            {( !isReadOnly && (
                <IngredientLine
                    key={"ingredient_new"}
                    search={search}
                    isReadOnly={isReadOnly}
                    references={references}
                    isNew={true}
                />
            ) )}

        </div>
    );
};

IngredientsBlock.displayName = "IngredientsBlock";


export default IngredientsBlock;
