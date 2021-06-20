import React from "react";
import { RecipePageStore } from "@store/recipe/types";
import NutritionFactsBlock from "@views/shared/NutritionFactsBlock";

import { NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import Utils from "@common/utils";

import ParametersBlock from "./ParametersBlock";

import styles from "./RecipePage.module.scss";



interface GeneralInfoBlockProps {
    recipeItem: RecipePageStore;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    nutritionFactInputs: Dictionary<NutritionFactType, string>;
}

const GeneralInfoBlock: React.FC<GeneralInfoBlockProps> = ({ recipeItem, nutritionFacts, nutritionFactInputs }) => {

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

                <NutritionFactsBlock
                    isReadOnly={true}
                    title={"NUTRITION FACTS"}
                    nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, nutritionFacts, nutritionFactInputs)}
                />
            </div>
        </div>
    );
};

GeneralInfoBlock.displayName = "GeneralInfoBlock";

export default GeneralInfoBlock;
