import React, { useEffect } from "react";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import { Color } from "@common/style";
import { isNone } from "@common/types";
import Utils, { ProductType } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppDispatch, useAppSelector } from "@store";
import * as actions from "@store/actions/recipe";
import { searchClear } from "@store/actions/search";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RecipePage from "./rba-recipe-page";


interface RecipePageQuery extends ParsedUrlQuery {
    rid: string;
}

const RecipePageConnected: React.FC = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { rid } = router.query as RecipePageQuery;
    const isNewRecipePage = isNone(rid);

    const recipe = useAppSelector((state) => state.recipe);
    const search = useAppSelector((state) => state.search);
    const meta = useAppSelector((state) => state.meta);

    useEffect(() => {
        if (!recipe.isLoading) {
            dispatch(searchClear());

            if (!isNewRecipePage) {
                const recipeId = Number(rid);
                dispatch(actions.fetchRecipe(recipeId));
            }
            else if (router.asPath.includes(Utils.getNewProductPath(ProductType.Recipe))) {

                if (recipe.isCreated) {
                    router.push(Utils.getProductPath(ProductType.Recipe, recipe.id));
                }
                else {
                    dispatch(actions.fetchRecipeNew());
                }
            }
        }
    }, [ rid, recipe.id ]);

    return (
        recipe.isLoaded
            ? (
                recipe.errorMessage
                    ? <RbaSingleMessagePage text={recipe.errorMessage} />
                    : (
                        <RecipePage
                            isReadOnly={!recipe.editMode}
                            recipe={recipe}
                            search={search}
                            meta={meta}
                            isNew={isNewRecipePage}
                        />
                    )
            )
            : (
                <RbaSingleMessagePage>
                    <RbaIconLoading size={IconSize.ExtraLarge} color={Color.White} />
                </RbaSingleMessagePage>
            )
    );
};

RecipePageConnected.displayName = "RecipePageConnected";

export default RecipePageConnected;
