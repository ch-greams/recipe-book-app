import React, { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import type { ParsedUrlQuery } from "querystring";

import { Color } from "@common/style";
import { isNone } from "@common/types";
import Utils, { ProductType } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppDispatch, useAppSelector } from "@store";
import * as actions from "@store/actions/food";
import { searchClear } from "@store/actions/search";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaFoodPage from "./rba-food-page";


interface FoodPageQuery extends ParsedUrlQuery {
    fid: string;
}

const RbaFoodPageConnected: React.FC = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { fid } = router.query as FoodPageQuery;
    const isNewFoodPage = isNone(fid);

    const food = useAppSelector((state) => state.food);
    const meta = useAppSelector((state) => state.meta);

    useEffect(() => {
        dispatch(searchClear());

        if (!isNewFoodPage) {
            const foodId = Number(fid);
            dispatch(actions.fetchFood(foodId));
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
                            meta={meta}
                            isNew={isNewFoodPage}
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

RbaFoodPageConnected.displayName = "RbaFoodPageConnected";


export default RbaFoodPageConnected;
