import React from "react";
import { useDispatch } from "react-redux";

import RbaGeneralInfoBlock from "@views/food/components/rba-general-info-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaPageDetailedNutritionFactsBlock from "@views/shared/rba-page-detailed-nutrition-facts-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import RbaPageTitleBlockInput from "@views/shared/rba-page-title-block-input";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";

import styles from "./rba-food-page.module.scss";


interface Props {
    isReadOnly: boolean;
    foodItem: FoodPageStore;
    isNew: boolean;
}

const RbaFoodPage: React.FC<Props> = ({ isReadOnly, foodItem, isNew }) => {

    const dispatch = useDispatch();

    const saveButtonAction = (
        isNew
            ? () => dispatch(actions.createFoodItemRequest())
            : () => dispatch(actions.updateFoodItemRequest())
    );
    const saveButton = (
        <RbaButton
            label={"SAVE"}
            width={ButtonWidthSize.Full}
            onClick={saveButtonAction}
        />
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

                {( !isReadOnly && saveButton )}

                {/* Title Block */}

                {(
                    isReadOnly
                        ? (
                            <RbaPageTitleBlock
                                name={name}
                                brand={brand}
                                subtitle={subtitle}
                                description={description}
                            />

                        )
                        : (
                            <RbaPageTitleBlockInput
                                name={name}
                                brand={brand}
                                subtitle={subtitle}
                                description={description}
                                updateName={actions.updateName}
                                updateBrand={actions.updateBrand}
                                updateSubtitle={actions.updateSubtitle}
                                updateDescription={actions.updateDescription}
                            />
                        )
                )}


                {/* Main Block */}

                <RbaGeneralInfoBlock
                    foodItem={foodItem}
                    featuredNutritionFacts={featuredNutritionFacts}
                    nutritionFacts={nutritionFactsByServing}
                    nutritionFactInputs={nutritionFactsByServingInputs}
                />

                {/* Detailed Nutrition Information  */}

                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutritionFactsBlock
                    isReadOnly={isReadOnly}
                    nutritionFacts={nutritionFactsByServing}
                    nutritionFactInputs={nutritionFactsByServingInputs}
                />

            </div>
        </div>

    );

};

RbaFoodPage.displayName = "RbaFoodPage";

export default RbaFoodPage;
