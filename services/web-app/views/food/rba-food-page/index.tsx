import React, { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import type { ParsedUrlQuery } from "querystring";

import { useLoginRedirect } from "@common/hooks";
import { getFoodPath, NEW_FOOD_PATH } from "@common/routes";
import { Color } from "@common/style";
import { isNone } from "@common/types";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import { useAppDispatch, useAppSelector } from "@store";
import * as foodActions from "@store/actions/food";
import { searchClear } from "@store/actions/search";
import type { MetaStore } from "@store/types/meta";
import type { UserStore } from "@store/types/user";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaFoodPage from "./rba-food-page";


interface FoodPageQuery extends ParsedUrlQuery {
    fid: string;
}

interface Props {
    user: UserStore;
    meta: MetaStore;
}

const RbaFoodPageConnected: React.FC<Props> = ({ meta, user }) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { fid } = router.query as FoodPageQuery;
    const isNewFoodPage = isNone(fid);

    const food = useAppSelector((state) => state.food);

    useLoginRedirect(user.isLoggedIn);

    useEffect(() => {
        if (!food.isLoading) {
            dispatch(searchClear());

            if (!isNewFoodPage) {
                const foodId = Number(fid);
                dispatch(foodActions.fetchFood(foodId));
            }
            else if (router.asPath.includes(NEW_FOOD_PATH)) {

                if (food.isCreated) {
                    router.push(getFoodPath(false, food.id));
                }
                else {
                    dispatch(foodActions.fetchFoodNew());
                }
            }
        }
    }, [ fid, food.id ]);

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
                            featuredNutrients={user.nutrients}
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
