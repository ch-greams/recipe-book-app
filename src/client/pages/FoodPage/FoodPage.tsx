import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Utils from "@common/utils";
import Loader from "@client/components/Loader/Loader";
import NutritionFactsBlock from "@client/components/NutritionFactsBlock/NutritionFactsBlock";
import PageDetailedNutritionFactsBlock from "@client/components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import PageTitleBlock from "@client/components/PageTitleBlock/PageTitleBlock";
import { AppState } from "@client/store";
import * as actions from "@client/store/food/actions";
import type { FoodPageStore } from "@client/store/food/types";

import ParametersBlock from "./ParametersBlock";

import styles from "./FoodPage.scss";


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
                                    nutritionFactsByServingInputs
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


const FoodPageConnected: React.FC<RouteComponentProps<{ foodId: string }>> = ({ match }) => {

    const dispatch = useDispatch();

    const foodItem = useSelector<AppState>((state) => state.foodPage) as FoodPageStore;

    useEffect(() => {
        dispatch(actions.fetchFoodItemRequest(match.params.foodId));
    }, [ dispatch ]);

    return (
        foodItem.isLoaded
            ? <FoodPage foodItem={foodItem} />
            : <Loader />
    );
};

FoodPageConnected.displayName = "FoodPageConnected";


export default FoodPageConnected;
