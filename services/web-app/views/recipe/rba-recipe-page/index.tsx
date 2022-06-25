import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import { isNone } from "@common/types";
import Utils, { ProductType } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";
import { searchClear } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import RecipePage from "./rba-recipe-page";


interface RecipePageQuery extends ParsedUrlQuery {
    rid: string;
}

const RecipePageConnected: React.FC = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const { rid } = router.query as RecipePageQuery;
    const isNewRecipePage = isNone(rid);

    const recipe = useSelector<AppState>((state) => state.recipePage) as RecipePageStore;
    const search = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    useEffect(() => {
        dispatch(searchClear());

        if (!isNewRecipePage) {
            const recipeId = Number(rid);
            dispatch(actions.fetchRecipeRequest(recipeId));
        }
        else if (router.asPath.includes(Utils.getNewProductPath(ProductType.Recipe))) {

            if (recipe.isCreated) {
                router.push(Utils.getProductPath(ProductType.Recipe, recipe.id));
            }
            else {
                dispatch(actions.fetchRecipeNew());
            }
        }
    }, [ dispatch, rid, recipe.id ]);

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
                            isNew={isNewRecipePage}
                        />
                    )
            )
            : <RbaSingleMessagePage text={"LOADING"} />
    );
};

RecipePageConnected.displayName = "RecipePageConnected";

export default RecipePageConnected;
