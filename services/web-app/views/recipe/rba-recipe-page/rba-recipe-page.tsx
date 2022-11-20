import React from "react";

import { NutrientName } from "@common/nutrients";
import RbaDirectionsBlock from "@views/recipe/components/rba-directions-block";
import RbaGeneralInfoBlock from "@views/recipe/components/rba-general-info-block";
import RbaIngredientsBlock from "@views/recipe/components/rba-ingredients-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import { RBA_BUTTON_LABEL_EDIT,RBA_BUTTON_LABEL_REVERT, RBA_BUTTON_LABEL_SAVE } from "@views/shared/rba-button/labels";
import RbaPageDetailedNutrientsBlock from "@views/shared/rba-page-detailed-nutrients-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import RbaPageTitleBlockInput from "@views/shared/rba-page-title-block-input";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { MetaStore } from "@store/types/meta";
import type { RecipePageStore } from "@store/types/recipe";
import type { SearchStore } from "@store/types/search";

import styles from "./rba-recipe-page.module.scss";



interface Props {
    isReadOnly: boolean;
    recipe: RecipePageStore;
    search: SearchStore;
    meta: MetaStore;
    isNew: boolean;
}

const RecipePage: React.FC<Props> = ({ isReadOnly, recipe, search, meta, isNew }) => {

    const dispatch = useAppDispatch();

    const saveButtonAction = (
        isNew
            ? () => dispatch(actions.createRecipe())
            : () => dispatch(actions.updateRecipe())
    );

    const pageControls = (
        <>
            <RbaButton
                label={RBA_BUTTON_LABEL_REVERT}
                disabled={isNew}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(actions.fetchRecipe(recipe.id))}
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
        ingredients,
        newDirection,
        directions,
        nutrientsByServing,
        nutrientsByServingInputs,
    } = recipe;

    const {
        nutrientDescriptions,
    } = meta;

    return (
        <div className={styles.recipePage}>

            <div className={styles.recipePageElements}>

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
                    recipe={recipe}
                    featuredNutrients={[
                        NutrientName.Energy,
                        NutrientName.Carbohydrate,
                        NutrientName.DietaryFiber,
                        NutrientName.Sugars,
                        NutrientName.Fat,
                        NutrientName.Monounsaturated,
                        NutrientName.Protein,
                        NutrientName.Sodium,
                        NutrientName.VitaminA,
                        NutrientName.VitaminC,
                    ]}
                    nutrients={nutrientsByServing}
                    nutrientInputs={nutrientsByServingInputs}
                    nutrientDescriptions={nutrientDescriptions}
                />

                <RbaBlockTitle text={"INGREDIENTS"} />

                <RbaIngredientsBlock
                    isReadOnly={isReadOnly}
                    isLoaded={recipe.isLoadedIngredients}
                    ingredients={ingredients}
                    search={search}
                />

                <RbaBlockTitle text={"DIRECTIONS"} />

                <RbaDirectionsBlock
                    isReadOnly={isReadOnly}
                    newDirection={newDirection}
                    directions={directions}
                    ingredients={ingredients}
                />

                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutrientsBlock
                    isReadOnly={true}
                    nutrients={nutrientsByServing}
                    nutrientInputs={nutrientsByServingInputs}
                    nutrientDescriptions={nutrientDescriptions}
                />

            </div>

        </div>
    );
};

RecipePage.displayName = "RecipePage";

export default RecipePage;
