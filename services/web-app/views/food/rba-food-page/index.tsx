import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import type { ParsedUrlQuery } from "querystring";

import { isNone } from "@common/types";
import Utils, { ProductType } from "@common/utils";
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
    const isNewFoodPage = isNone(fid);

    const food = useSelector<AppState>((state) => state.foodPage) as FoodPageStore;

    useEffect(() => {
        dispatch(searchClear());

        if (!isNewFoodPage) {
            const foodId = Number(fid);
            dispatch(actions.fetchFoodRequest(foodId));
        }
        else if (router.asPath.includes(Utils.getNewProductPath(ProductType.Food))) {

            if (food.isCreated) {
                router.push(Utils.getProductPath(ProductType.Food, food.id));
            }
            else {
                dispatch(actions.fetchFoodNew());
            }
        }
    }, [ dispatch, fid, food.id ]);

    return (
        food.isLoaded
            ? (
                food.errorMessage
                    ? <RbaSingleMessagePage text={food.errorMessage} />
                    : (
                        <RbaFoodPage
                            isReadOnly={!food.editMode}
                            food={food}
                            isNew={isNewFoodPage}
                        />
                    )
            )
            : <RbaSingleMessagePage text={"LOADING"} />
    );
};

RbaFoodPageConnected.displayName = "RbaFoodPageConnected";


export default RbaFoodPageConnected;
