import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import Utils, { RoutePath } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";
import { requestIngredients } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import RecipePage from "./rba-recipe-page";


interface RecipePageQuery extends ParsedUrlQuery {
    edit: string;
    rid: string;
}

const RecipePageConnected: React.FC = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const { rid, edit: isEdit } = router.query as RecipePageQuery;
    const isNewRecipePage = !Utils.isSome(rid);

    const recipeItem = useSelector<AppState>((state) => state.recipePage) as RecipePageStore;
    const search = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    useEffect(() => {
        if (!isNewRecipePage) {
            const recipeId = Number(rid);
            dispatch(actions.fetchRecipeItemRequest(recipeId));
            dispatch(requestIngredients());
        }
        else if (router.asPath.includes(Utils.getNewItemPath(RoutePath.Recipe))) {

            if (recipeItem.isCreated) {
                router.push(Utils.getItemPath(RoutePath.Recipe, recipeItem.id));
            }
            else {
                dispatch(actions.fetchRecipeItemNew());
            }
        }
    }, [ dispatch, rid, recipeItem.id ]);

    return (
        recipeItem.isLoaded
            ? (
                recipeItem.errorMessage
                    ? <RbaSingleMessagePage text={recipeItem.errorMessage} />
                    : (
                        <RecipePage
                            isReadOnly={!( isEdit === "true" )}
                            recipeItem={recipeItem}
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
