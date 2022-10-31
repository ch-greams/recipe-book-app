import React from "react";

import { NutritionFactType } from "@common/nutritionFacts";
import RbaDirectionsBlock from "@views/recipe/components/rba-directions-block";
import RbaGeneralInfoBlock from "@views/recipe/components/rba-general-info-block";
import RbaIngredientsBlock from "@views/recipe/components/rba-ingredients-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import { RBA_BUTTON_LABEL_EDIT,RBA_BUTTON_LABEL_REVERT, RBA_BUTTON_LABEL_SAVE } from "@views/shared/rba-button/labels";
import RbaPageDetailedNutritionFactsBlock from "@views/shared/rba-page-detailed-nutrition-facts-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import RbaPageTitleBlockInput from "@views/shared/rba-page-title-block-input";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipePageStore } from "@store/types/recipe";
import type { SearchPageStore } from "@store/types/search";

import styles from "./rba-recipe-page.module.scss";



interface Props {
    isReadOnly: boolean;
    recipe: RecipePageStore;
    search: SearchPageStore;
    isNew: boolean;
}

const RecipePage: React.FC<Props> = ({ isReadOnly, recipe, search, isNew }) => {

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
        nutritionFactsByServing,
        nutritionFactsByServingInputs,
    } = recipe;

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
                    featuredNutritionFacts={[
                        NutritionFactType.Energy,
                        NutritionFactType.Carbohydrate,
                        NutritionFactType.DietaryFiber,
                        NutritionFactType.Sugars,
                        NutritionFactType.Fat,
                        NutritionFactType.Monounsaturated,
                        NutritionFactType.Protein,
                        NutritionFactType.Sodium,
                        NutritionFactType.VitaminA,
                        NutritionFactType.VitaminC,
                    ]}
                    nutritionFacts={nutritionFactsByServing}
                    nutritionFactInputs={nutritionFactsByServingInputs}
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

                <RbaPageDetailedNutritionFactsBlock
                    isReadOnly={true}
                    nutritionFacts={nutritionFactsByServing}
                    nutritionFactInputs={nutritionFactsByServingInputs}
                />

            </div>

        </div>
    );
};

RecipePage.displayName = "RecipePage";

export default RecipePage;
