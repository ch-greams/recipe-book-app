import React from "react";

import type { Dictionary, IngredientItem } from "@common/typings";
import type { RecipeIngredientDefault } from "@client/store/recipe/types";
import type { SearchPageStore } from "@client/store/search/types";

import IngredientLine from "./IngredientLine";

import styles from "./IngredientsBlock.scss";



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
