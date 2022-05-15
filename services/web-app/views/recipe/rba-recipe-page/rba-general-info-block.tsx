import React from "react";

import { NutritionFactType } from "@common/nutritionFacts";
import Utils from "@common/utils";
import RbaNutritionFactsBlock from "@views/shared/rba-nutrition-facts-block";
import type { RecipePageStore } from "@store/recipe/types";

import ParametersBlock from "./rba-parameters-block";

import styles from "./rba-recipe-page.module.scss";



interface GeneralInfoBlockProps {
    recipeItem: RecipePageStore;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    nutritionFactInputs: Dictionary<NutritionFactType, string>;
}

const RbaGeneralInfoBlock: React.FC<GeneralInfoBlockProps> = ({ recipeItem, nutritionFacts, nutritionFactInputs }) => {

    const featuredNutritionFacts = [
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
    ];

    return (
        <div className={styles.mainBlock}>

            <ParametersBlock recipeItem={recipeItem} />

            <div className={styles.featuredNutritionFacts}>

                <RbaNutritionFactsBlock
                    isReadOnly={true}
                    title={"NUTRITION FACTS"}
                    nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, nutritionFacts, nutritionFactInputs)}
                />
            </div>
        </div>
    );
};

RbaGeneralInfoBlock.displayName = "RbaGeneralInfoBlock";

export default RbaGeneralInfoBlock;
