import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import Utils, { RoutePath } from "@common/utils";
import BlockTitle from "@views/shared/block-title";
import NutritionFactsBlock from "@views/shared/nutrition-facts-block";
import PageDetailedNutritionFactsBlock from "@views/shared/page-detailed-nutrition-facts-block";
import PageTitleBlock from "@views/shared/page-title-block";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import SingleMessagePage from "@views/shared/single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";

import ParametersBlock from "./parameters-block";

import styles from "./food-page.module.scss";


interface Props {
    foodItem: FoodPageStore;
    isNew: boolean;
}

const FoodPage: React.FC<Props> = ({ foodItem, isNew }) => {

    const dispatch = useDispatch();

    const saveButtonAction = (
        isNew
            ? () => dispatch(actions.createFoodItemRequest())
            : () => dispatch(actions.updateFoodItemRequest())
    );

    const {
        name,
        brand,
        subtitle,
        description,
        nutritionFactsByServing,
        nutritionFactsByServingInputs,
        featuredNutritionFacts,
    } = foodItem;

    return (
        <div className={styles.foodPage}>

            <div className={styles.foodPageElements}>

                <RbaButton
                    label={"SAVE"}
                    width={ButtonWidthSize.Full}
                    onClick={saveButtonAction}
                />

                {/* Title Block */}

                <PageTitleBlock
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    withDescription={true}
                    updateName={actions.updateName}
                    updateBrand={actions.updateBrand}
                    updateSubtitle={actions.updateSubtitle}
                    updateDescription={actions.updateDescription}
                />

                {/* Main Block */}

                <div className={styles.mainBlock}>

                    <ParametersBlock foodItem={foodItem} />

                    <div className={styles.featuredNutritionFacts}>

                        <NutritionFactsBlock
                            title={"NUTRITION FACTS"}
                            nutritionFacts={
                                Utils.getNutritionFacts(
                                    featuredNutritionFacts,
                                    nutritionFactsByServing,
                                    nutritionFactsByServingInputs,
                                )
                            }
                        />
                    </div>

                </div>

                {/* Detailed Nutrition Information  */}

                <BlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <PageDetailedNutritionFactsBlock
                    nutritionFacts={nutritionFactsByServing}
                    nutritionFactInputs={nutritionFactsByServingInputs}
                />

            </div>
        </div>

    );

};

FoodPage.displayName = "FoodPage";


const FoodPageConnected: React.FC = () => {

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
                    ? <SingleMessagePage text={foodItem.errorMessage} />
                    : <FoodPage foodItem={foodItem} isNew={isNewFoodPage} />
            )
            : <SingleMessagePage text={"LOADING"} />
    );
};

FoodPageConnected.displayName = "FoodPageConnected";


export default FoodPageConnected;
