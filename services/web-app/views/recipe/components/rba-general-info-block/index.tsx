import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutritionFacts";
import Utils from "@common/utils";
import RbaParametersBlock from "@views/recipe/components/rba-parameters-block";
import RbaNutritionFactsBlock from "@views/shared/rba-nutrition-facts-block";
import type { RecipePageStore } from "@store/types/recipe";

import styles from "./rba-general-info-block.module.scss";



interface GeneralInfoBlockProps {
    recipe: RecipePageStore;
    featuredNutritionFacts: NutrientName[];
    nutritionFacts: Dictionary<NutrientName, number>;
    nutritionFactInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}

const RbaGeneralInfoBlock: React.FC<GeneralInfoBlockProps> = ({
    recipe, featuredNutritionFacts, nutritionFacts, nutritionFactInputs, nutrientDescriptions,
}) => {

    const nutrients = Utils.getNutritionFacts(
        featuredNutritionFacts,
        nutritionFacts,
        nutritionFactInputs,
        nutrientDescriptions,
    );

    return (
        <div className={styles.mainBlock}>

            <RbaParametersBlock recipe={recipe} />

            <div className={styles.featuredNutritionFacts}>

                <RbaNutritionFactsBlock
                    isReadOnly={true}
                    title={"NUTRITION FACTS"}
                    nutritionFacts={nutrients}
                />
            </div>
        </div>
    );
};

RbaGeneralInfoBlock.displayName = "RbaGeneralInfoBlock";

export default RbaGeneralInfoBlock;
