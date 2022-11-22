import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import Utils, { ProductType } from "@common/utils";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonHeightSize,ButtonWidthSize } from "@views/shared/rba-button";

import styles from "./rba-recipes-block.module.scss";


// TODO: Replace it with real type
interface RecipeItem {
    id: number;
    name: string;
}

interface Props {
    favoriteRecipes: RecipeItem[];
    customRecipes: RecipeItem[];
    deleteFavoriteRecipe: (productId: number) => void;
    deleteCustomRecipe: (productId: number) => void;
}


const RbaRecipesBlock: React.FC<Props> = ({
    favoriteRecipes,
    customRecipes,
    deleteFavoriteRecipe,
    deleteCustomRecipe,
}) => {

    return (
        <div className={styles.recipesBlock}>

            <RbaBlockTitle text={"Favorites"} />

            <div className={styles.recipeList}>
                {favoriteRecipes.map((recipe) => (
                    <div key={recipe.id} className={styles.recipeLine}>
                        <Link href={Utils.getProductPath(ProductType.Recipe, recipe.id)}>
                            <div data-cy={constants.CY_USER_RECIPE_FAVORITE_ITEM} className={styles.recipeName}>
                                {recipe.name}
                            </div>
                        </Link>

                        <RbaButton
                            label={"Delete"}
                            width={ButtonWidthSize.Full}
                            height={ButtonHeightSize.Full}
                            onClick={() => { deleteFavoriteRecipe(recipe.id); }}
                        />
                    </div>
                ))}
            </div>

            <RbaBlockTitle text={"My Own"} />

            <div className={styles.recipeList}>
                {customRecipes.map((recipe) => (
                    <div key={recipe.id} className={styles.recipeLine}>
                        <Link href={Utils.getProductPath(ProductType.Recipe, recipe.id)}>
                            <div data-cy={constants.CY_USER_RECIPE_CUSTOM_ITEM} className={styles.recipeName}>
                                {recipe.name}
                            </div>
                        </Link>

                        <RbaButton
                            label={"Delete"}
                            width={ButtonWidthSize.Full}
                            height={ButtonHeightSize.Full}
                            onClick={() => { deleteCustomRecipe(recipe.id); }}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

RbaRecipesBlock.displayName = "RbaRecipesBlock";

export default RbaRecipesBlock;
