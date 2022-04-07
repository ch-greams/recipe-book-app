import React from "react";

import BlockTitle from "@views/shared/block-title";

import styles from "./recipes-block.module.scss";


// TODO: Replace it with real type
interface RecipeItem {
    id: number;
    name: string;
}

interface RecipesBlockProps {
    recipes: RecipeItem[];
}


const RecipesBlock: React.FC<RecipesBlockProps> = ({ recipes }) => {

    return (
        <div className={styles.recipesBlock}>

            <BlockTitle text={"Favorites"} />

            <div className={styles.itemList}>
                {recipes.map((recipe) => (
                    <div key={recipe.id} className={styles.infoLine}>
                        {recipe.name}
                    </div>
                ))}
            </div>

            <BlockTitle text={"My Own"} />

            <div className={styles.itemList}>
                {recipes.map((recipe) => (
                    <div key={recipe.id} className={styles.infoLine}>
                        {recipe.name}
                    </div>
                ))}
            </div>

        </div>
    );
};

RecipesBlock.displayName = "FoodsBlock";

export default RecipesBlock;
