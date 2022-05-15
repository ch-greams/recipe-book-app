import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import Utils, { RoutePath } from "@common/utils";
import RbaBlockTitle from "@views/shared/rba-block-title";

import styles from "./rba-recipes-block.module.scss";


// TODO: Replace it with real type
interface RecipeItem {
    id: number;
    name: string;
}

interface Props {
    favoriteRecipes: RecipeItem[];
    customRecipes: RecipeItem[];
}


const RbaRecipesBlock: React.FC<Props> = ({ favoriteRecipes, customRecipes }) => {

    return (
        <div className={styles.recipesBlock}>

            <RbaBlockTitle text={"Favorites"} />

            <div className={styles.itemList}>
                {favoriteRecipes.map((recipe) => (
                    <Link key={recipe.id} href={Utils.getItemPath(RoutePath.Recipe, recipe.id)}>
                        <div data-cy={constants.CY_USER_RECIPE_FAVORITE_ITEM} className={styles.infoLine}>
                            {recipe.name}
                        </div>
                    </Link>
                ))}
            </div>

            <RbaBlockTitle text={"My Own"} />

            <div className={styles.itemList}>
                {customRecipes.map((recipe) => (
                    <Link key={recipe.id} href={Utils.getItemPath(RoutePath.Recipe, recipe.id)}>
                        <div data-cy={constants.CY_USER_RECIPE_CUSTOM_ITEM} className={styles.infoLine}>
                            {recipe.name}
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

RbaRecipesBlock.displayName = "RbaRecipesBlock";

export default RbaRecipesBlock;
