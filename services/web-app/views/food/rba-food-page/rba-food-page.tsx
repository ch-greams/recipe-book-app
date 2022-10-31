import React from "react";

import RbaGeneralInfoBlock from "@views/food/components/rba-general-info-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import { RBA_BUTTON_LABEL_EDIT,RBA_BUTTON_LABEL_REVERT, RBA_BUTTON_LABEL_SAVE } from "@views/shared/rba-button/labels";
import RbaPageDetailedNutritionFactsBlock from "@views/shared/rba-page-detailed-nutrition-facts-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import RbaPageTitleBlockInput from "@views/shared/rba-page-title-block-input";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/food";
import type { FoodPageStore } from "@store/types/food";

import styles from "./rba-food-page.module.scss";


interface Props {
    isReadOnly: boolean;
    food: FoodPageStore;
    isNew: boolean;
}

const RbaFoodPage: React.FC<Props> = ({ isReadOnly, food, isNew }) => {

    const dispatch = useAppDispatch();

    const saveButtonAction = (
        isNew
            ? () => dispatch(actions.createFood())
            : () => dispatch(actions.updateFood())
    );

    const pageControls = (
        <>
            <RbaButton
                label={RBA_BUTTON_LABEL_REVERT}
                disabled={isNew}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(actions.fetchFood(food.id))}
            />

            <RbaButton
                label={RBA_BUTTON_LABEL_SAVE}
                width={ButtonWidthSize.Full}
                onClick={saveButtonAction}
            />
        </>
    );

    const editButton = (
        <RbaButton
            label={RBA_BUTTON_LABEL_EDIT}
            width={ButtonWidthSize.Full}
            onClick={() => dispatch(actions.setEditMode(true))}
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
    } = food;

    return (
        <div className={styles.foodPage}>

            <div className={styles.foodPageElements}>

                {/* Page Controls Block */}

                <div className={styles.pageControls}>
                    {( isReadOnly ? editButton : pageControls )}
                </div>

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
                    food={food}
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
