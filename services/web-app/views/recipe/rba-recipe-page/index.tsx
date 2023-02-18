import React, { useEffect } from "react";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import { useLoginRedirect } from "@common/hooks";
import { getRecipePath, NEW_RECIPE_PATH } from "@common/routes";
import { Color } from "@common/style";
import { isNone } from "@common/types";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppDispatch, useAppSelector } from "@store";
import * as recipeActions from "@store/actions/recipe";
import { searchClear } from "@store/actions/search";
import type { MetaStore } from "@store/types/meta";
import type { UserStore } from "@store/types/user";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaRecipePage from "./rba-recipe-page";


interface RecipePageQuery extends ParsedUrlQuery {
    rid: string;
}

interface Props {
    user: UserStore;
    meta: MetaStore;
}

const RbaRecipePageConnected: React.FC<Props> = ({ meta, user }) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { rid } = router.query as RecipePageQuery;
    const isNewRecipePage = isNone(rid);

    const { recipe, search } = useAppSelector((state) => state);

    useLoginRedirect(user.isLoggedIn);

    useEffect(() => {
        if (!recipe.isLoading) {
            dispatch(searchClear());

            if (!isNewRecipePage) {
                const recipeId = Number(rid);
                dispatch(recipeActions.fetchRecipe(recipeId));
            }
            else if (router.asPath.includes(NEW_RECIPE_PATH)) {

                if (recipe.isCreated) {
                    router.push(getRecipePath(recipe.id));
                }
                else {
                    dispatch(recipeActions.fetchRecipeNew());
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
                        <RbaRecipePage
                            isReadOnly={!recipe.editMode}
                            recipe={recipe}
                            search={search}
                            meta={meta}
                            featuredNutrients={user.nutrients}
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

RbaRecipePageConnected.displayName = "RbaRecipePageConnected";

export default RbaRecipePageConnected;
