import React from "react";
import { useRouter } from "next/router";

import { BUTTON_DELETE, BUTTON_EDIT,BUTTON_REVERT, BUTTON_SAVE } from "@common/labels";
import type { NutrientName } from "@common/nutrients";
import RbaGeneralInfoBlock from "@views/food/components/rba-general-info-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaPageDetailedNutrientsBlock from "@views/shared/rba-page-detailed-nutrients-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import RbaPageTitleBlockInput from "@views/shared/rba-page-title-block-input";
import { useAppDispatch } from "@store";
import * as foodActions from "@store/actions/food";
import * as userActions from "@store/actions/user";
import type { FoodPageStore } from "@store/types/food";
import type { MetaStore } from "@store/types/meta";
import type { UserStoreNutrient } from "@store/types/user";

import styles from "./rba-food-page.module.scss";


interface Props {
    isReadOnly: boolean;
    food: FoodPageStore;
    meta: MetaStore;
    featuredNutrients: UserStoreNutrient[];
    isNew: boolean;
}

const RbaFoodPage: React.FC<Props> = ({ isReadOnly, food, meta, featuredNutrients, isNew }) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const saveButtonAction = (
        isNew
            ? () => dispatch(foodActions.createFood())
            : () => dispatch(foodActions.updateFood())
    );

    const pageControls = (
        <>
            <RbaButton
                label={BUTTON_REVERT}
                disabled={isNew}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(foodActions.fetchFood(food.id))}
            />

            <RbaButton
                label={BUTTON_SAVE}
                width={ButtonWidthSize.Full}
                onClick={saveButtonAction}
            />
        </>
    );

    const editButtons = (
        <>
            <RbaButton
                label={BUTTON_DELETE}
                width={ButtonWidthSize.Full}
                onClick={() => {
                    dispatch(userActions.deleteCustomProduct(food.id));
                    router.push("/");
                }}
            />

            <RbaButton
                label={BUTTON_EDIT}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(foodActions.setEditMode(true))}
            />
        </>
    );

    const {
        name,
        brand,
        description,
        nutrientsByServing,
        nutrientsByServingInputs,
    } = food;

    const {
        nutrientDescriptions,
    } = meta;

    return (
        <div className={styles.foodPage}>

            <div className={styles.foodPageElements}>

                {/* Page Controls Block */}

                <div className={styles.pageControls}>
                    {( isReadOnly ? editButtons : pageControls )}
                </div>

                {/* Title Block */}

                {(
                    isReadOnly
                        ? (
                            <RbaPageTitleBlock
                                name={name}
                                brand={brand}
                                description={description}
                            />

                        )
                        : (
                            <RbaPageTitleBlockInput
                                name={name}
                                brand={brand}
                                description={description}
                                updateName={foodActions.updateName}
                                updateBrand={foodActions.updateBrand}
                                updateDescription={foodActions.updateDescription}
                            />
                        )
                )}


                {/* Main Block */}

                <RbaGeneralInfoBlock
                    food={food}
                    featuredNutrients={featuredNutrients.map((nutrient) => nutrient.nutrientName as NutrientName)}
                    nutrients={nutrientsByServing}
                    nutrientInputs={nutrientsByServingInputs}
                    nutrientDescriptions={nutrientDescriptions}
                />

                {/* Detailed Nutrition Information  */}

                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutrientsBlock
                    isReadOnly={isReadOnly}
                    nutrients={nutrientsByServing}
                    nutrientInputs={nutrientsByServingInputs}
                    nutrientDescriptions={nutrientDescriptions}
                />

            </div>
        </div>

    );

};

RbaFoodPage.displayName = "RbaFoodPage";

export default RbaFoodPage;
