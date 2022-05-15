import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import Utils, { RoutePath } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";

import RbaFoodPage from "./rba-food-page";


const RbaFoodPageConnected: React.FC = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const { query: { fid } } = router;
    const isNewFoodPage = !Utils.isSome(fid);

    const foodItem = useSelector<AppState>((state) => state.foodPage) as FoodPageStore;

    useEffect(() => {
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
                    : <RbaFoodPage foodItem={foodItem} isNew={isNewFoodPage} />
            )
            : <RbaSingleMessagePage text={"LOADING"} />
    );
};

RbaFoodPageConnected.displayName = "RbaFoodPageConnected";


export default RbaFoodPageConnected;
