import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

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
    const isNewRecipePage = !Utils.isSome(rid);

    const recipeItem = useSelector<AppState>((state) => state.recipePage) as RecipePageStore;
    const search = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    useEffect(() => {
        dispatch(searchClear());

        if (!isNewRecipePage) {
            const recipeId = Number(rid);
            dispatch(actions.fetchRecipeItemRequest(recipeId));
        }
        else if (router.asPath.includes(Utils.getNewItemPath(ProductType.Recipe))) {

            if (recipeItem.isCreated) {
                router.push(Utils.getItemPath(ProductType.Recipe, recipeItem.id));
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
                            isReadOnly={!recipeItem.editMode}
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
