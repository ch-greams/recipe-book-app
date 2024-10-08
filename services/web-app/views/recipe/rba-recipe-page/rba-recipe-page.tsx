import React from "react";
import { useRouter } from "next/router";

import { BUTTON_DELETE, BUTTON_EDIT,BUTTON_REVERT, BUTTON_SAVE } from "@common/labels";
import type { NutrientName } from "@common/nutrients";
import RbaGeneralInfoBlock from "@views/recipe/components/rba-general-info-block";
import RbaIngredientsBlock from "@views/recipe/components/rba-ingredients-block";
import RbaInstructionsBlock from "@views/recipe/components/rba-instructions-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaPageDetailedNutrientsBlock from "@views/shared/rba-page-detailed-nutrients-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import RbaPageTitleBlockInput from "@views/shared/rba-page-title-block-input";
import { useAppDispatch } from "@store";
import * as recipeActions from "@store/actions/recipe";
import * as userActions from "@store/actions/user";
import type { MetaStore } from "@store/types/meta";
import type { RecipePageStore } from "@store/types/recipe";
import type { SearchStore } from "@store/types/search";
import type { UserStoreNutrient } from "@store/types/user";

import styles from "./rba-recipe-page.module.scss";



interface Props {
    isReadOnly: boolean;
    recipe: RecipePageStore;
    search: SearchStore;
    meta: MetaStore;
    featuredNutrients: UserStoreNutrient[];
    isNew: boolean;
}

const RbaRecipePage: React.FC<Props> = ({ isReadOnly, recipe, search, meta, featuredNutrients, isNew }) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const saveButtonAction = (
        isNew
            ? () => dispatch(recipeActions.createRecipe())
            : () => dispatch(recipeActions.updateRecipe())
    );

    const updateNutrient = (name: NutrientName, value: string): void => {
        dispatch(recipeActions.updateNutrient({ key: name, value: value }));
    };

    const editModeButtons = (
        <>
            <RbaButton
                label={BUTTON_REVERT}
                disabled={isNew}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(recipeActions.fetchRecipe(recipe.id))}
            />

            <RbaButton
                label={( recipe.isRecipe ? "SWITCH TO FOOD" : "SWITCH TO RECIPE" )}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(recipeActions.setIsRecipe(!recipe.isRecipe))}
            />

            <RbaButton
                label={BUTTON_SAVE}
                width={ButtonWidthSize.Full}
                onClick={saveButtonAction}
            />
        </>
    );

    const readModeButtons = (
        <>
            <RbaButton
                label={BUTTON_DELETE}
                width={ButtonWidthSize.Full}
                onClick={() => {
                    dispatch(userActions.deleteCustomFood(recipe.id));
                    router.push("/");
                }}
            />

            <RbaButton
                label={BUTTON_EDIT}
                width={ButtonWidthSize.Full}
                onClick={() => dispatch(recipeActions.setEditMode(true))}
            />
        </>
    );

    const {
        name,
        brand,
        description,
        ingredients,
        instructions,
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
                    {( isReadOnly ? readModeButtons : editModeButtons )}
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
                                updateName={recipeActions.updateName}
                                updateBrand={recipeActions.updateBrand}
                                updateDescription={recipeActions.updateDescription}
                            />
                        )
                )}

                {/* Main Block */}

                <RbaGeneralInfoBlock
                    recipe={recipe}
                    featuredNutrients={featuredNutrients.map((nutrient) => nutrient.nutrientName as NutrientName)}
                    nutrients={nutrientsByServing}
                    nutrientInputs={nutrientsByServingInputs}
                    nutrientDescriptions={nutrientDescriptions}
                    updateNutrient={updateNutrient}
                />

                {(
                    recipe.isRecipe && (
                        <>
                            <RbaBlockTitle text={"INGREDIENTS"} />

                            {!isReadOnly && (
                                <RbaButton
                                    label={"calculate nutrients & serving size from ingredients".toUpperCase()}
                                    width={ButtonWidthSize.Full}
                                    onClick={() => dispatch(recipeActions.calculateNutrientsAndServingSize())}
                                />
                            )}

                            <RbaIngredientsBlock
                                isReadOnly={isReadOnly}
                                isLoaded={recipe.isLoadedIngredients}
                                ingredients={ingredients}
                                search={search}
                            />

                            <RbaBlockTitle text={"INSTRUCTIONS"} />

                            <RbaInstructionsBlock
                                isReadOnly={isReadOnly}
                                instructions={instructions}
                                ingredients={ingredients}
                            />
                        </>
                    )
                )}


                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutrientsBlock
                    isReadOnly={isReadOnly}
                    nutrients={nutrientsByServing}
                    nutrientInputs={nutrientsByServingInputs}
                    nutrientDescriptions={nutrientDescriptions}
                    updateNutrient={updateNutrient}
                />

            </div>

        </div>
    );
};

RbaRecipePage.displayName = "RbaRecipePage";

export default RbaRecipePage;
