import React from "react";
import { useDispatch } from "react-redux";

import { NutritionFactType } from "@common/nutritionFacts";
import Utils from "@common/utils";
import RbaDirectionsBlock from "@views/recipe/components/rba-directions-block";
import RbaGeneralInfoBlock from "@views/recipe/components/rba-general-info-block";
import RbaIngredientsBlock from "@views/recipe/components/rba-ingredients-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import RbaPageDetailedNutritionFactsBlock from "@views/shared/rba-page-detailed-nutrition-facts-block";
import RbaPageTitleBlock from "@views/shared/rba-page-title-block";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";

import styles from "./rba-recipe-page.module.scss";



interface Props {
    isReadOnly: boolean;
    recipeItem: RecipePageStore;
    search: SearchPageStore;
    isNew: boolean;
}

const RecipePage: React.FC<Props> = ({ isReadOnly, recipeItem, search, isNew }) => {

    const dispatch = useDispatch();

    const saveButtonAction = (
        isNew
            ? () => dispatch(actions.createRecipeItemRequest())
            : () => dispatch(actions.updateRecipeItemRequest())
    );

    const {
        name,
        brand,
        subtitle,
        description,
        ingredients,
        newDirection,
        directions,
        nutritionFacts,
    } = recipeItem;


    const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);

    return (
        <div className={styles.recipePage}>

            <div className={styles.recipePageElements}>

                {(isReadOnly || (
                    <RbaButton
                        label={"SAVE"}
                        width={ButtonWidthSize.Full}
                        onClick={saveButtonAction}
                    />
                ))}

                {/* Title Block */}

                <RbaPageTitleBlock
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    updateName={actions.updateName}
                    updateBrand={actions.updateBrand}
                    updateSubtitle={actions.updateSubtitle}
                    updateDescription={actions.updateDescription}
                />

                {/* Main Block */}

                <RbaGeneralInfoBlock
                    recipeItem={recipeItem}
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
                    nutritionFacts={nutritionFacts}
                    nutritionFactInputs={nutritionFactInputs}
                />

                <RbaBlockTitle text={"INGREDIENTS"} />

                <RbaIngredientsBlock
                    isReadOnly={isReadOnly}
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
                    nutritionFacts={nutritionFacts}
                    nutritionFactInputs={nutritionFactInputs}
                />

            </div>

        </div>
    );
};

RecipePage.displayName = "RecipePage";

export default RecipePage;
