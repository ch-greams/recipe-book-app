import React from "react";

import type { NutritionFactType } from "@common/nutritionFacts";
import Utils from "@common/utils";
import RbaParametersBlock from "@views/recipe/components/rba-parameters-block";
import RbaNutritionFactsBlock from "@views/shared/rba-nutrition-facts-block";
import type { RecipePageStore } from "@store/recipe/types";

import styles from "./rba-general-info-block.module.scss";



interface GeneralInfoBlockProps {
    recipe: RecipePageStore;
    featuredNutritionFacts: NutritionFactType[];
    nutritionFacts: Dictionary<NutritionFactType, number>;
    nutritionFactInputs: Dictionary<NutritionFactType, string>;
}

const RbaGeneralInfoBlock: React.FC<GeneralInfoBlockProps> = ({
    recipe, featuredNutritionFacts, nutritionFacts, nutritionFactInputs,
}) => {
    return (
        <div className={styles.mainBlock}>

            <RbaParametersBlock recipe={recipe} />

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
