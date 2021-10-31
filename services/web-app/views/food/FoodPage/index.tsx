import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import Utils from "@common/utils";
import NutritionFactsBlock from "@views/shared/NutritionFactsBlock";
import PageDetailedNutritionFactsBlock from "@views/shared/PageDetailedNutritionFactsBlock";
import PageTitleBlock from "@views/shared/PageTitleBlock";
import SingleMessagePage from "@views/shared/SingleMessagePage";
import type { AppState } from "@store";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";

import ParametersBlock from "./ParametersBlock";

import styles from "./FoodPage.module.scss";


interface Props {
    foodItem: FoodPageStore;
}

const FoodPage: React.FC<Props> = ({ foodItem }) => {

    const {
        name,
        brand,
        subtitle,
        nutritionFactsByServing,
        nutritionFactsByServingInputs,
        featuredNutritionFacts,
    } = foodItem;

    return (
        <div className={styles.foodPage}>

            <div className={styles.foodPageElements}>

                {/* Title Block */}

                <PageTitleBlock
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    updateName={actions.updateName}
                    updateBrand={actions.updateBrand}
                    updateSubtitle={actions.updateSubtitle}
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

                <div className={styles.pageBlockTitle}>
                    {"DETAILED NUTRITION INFORMATION"}
                </div>

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

    const router = useRouter();
    const foodId = Number(router.query.fid);
    
    const dispatch = useDispatch();

    const foodItem = useSelector<AppState>((state) => state.foodPage) as FoodPageStore;

    useEffect(() => {
        if (Utils.isSome(foodId)) {
            dispatch(actions.fetchFoodItemRequest(foodId));
        }
    }, [ dispatch, foodId ]);

    return (
        foodItem.isLoaded
            ? (
                foodItem.errorMessage
                    ? <SingleMessagePage text={foodItem.errorMessage} />
                    : <FoodPage foodItem={foodItem} />
            )
            : <SingleMessagePage text={"LOADING"} />
    );
};

FoodPageConnected.displayName = "FoodPageConnected";


export default FoodPageConnected;
