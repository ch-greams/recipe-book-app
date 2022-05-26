import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import type { ParsedUrlQuery } from "querystring";

import Utils, { RoutePath } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";
import { searchClear } from "@store/search/actions";

import RbaFoodPage from "./rba-food-page";


interface FoodPageQuery extends ParsedUrlQuery {
    fid: string;
}

const RbaFoodPageConnected: React.FC = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const { fid } = router.query as FoodPageQuery;
    const isNewFoodPage = !Utils.isSome(fid);

    const foodItem = useSelector<AppState>((state) => state.foodPage) as FoodPageStore;

    useEffect(() => {
        dispatch(searchClear());

        if (!isNewFoodPage) {
            const foodId = Number(fid);
            dispatch(actions.fetchFoodItemRequest(foodId));
        }
        else if (router.asPath.includes(Utils.getNewItemPath(RoutePath.Food))) {

            if (foodItem.isCreated) {
                router.push(Utils.getItemPath(RoutePath.Food, foodItem.id));
            }
            else {
                dispatch(actions.fetchFoodItemNew());
            }
        }
    }, [ dispatch, fid, foodItem.id ]);

    return (
        foodItem.isLoaded
            ? (
                foodItem.errorMessage
                    ? <RbaSingleMessagePage text={foodItem.errorMessage} />
                    : (
                        <RbaFoodPage
                            isReadOnly={!foodItem.editMode}
                            foodItem={foodItem}
                            isNew={isNewFoodPage}
                        />
                    )
            )
            : <RbaSingleMessagePage text={"LOADING"} />
    );
};

RbaFoodPageConnected.displayName = "RbaFoodPageConnected";


export default RbaFoodPageConnected;
