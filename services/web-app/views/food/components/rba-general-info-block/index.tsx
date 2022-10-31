import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutritionFacts";
import Utils from "@common/utils";
import RbaParametersBlock from "@views/food/components/rba-parameters-block";
import RbaNutritionFactsBlock from "@views/shared/rba-nutrition-facts-block";
import type { FoodPageStore } from "@store/types/food";

import styles from "./rba-general-info-block.module.scss";



interface Props {
    food: FoodPageStore;
    featuredNutritionFacts: NutrientName[];
    nutritionFacts: Dictionary<NutrientName, number>;
    nutritionFactInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}

const RbaGeneralInfoBlock: React.FC<Props> = ({
    food, featuredNutritionFacts, nutritionFacts, nutritionFactInputs, nutrientDescriptions,
}) => {

    const nutrients = Utils.getNutritionFacts(
        featuredNutritionFacts,
        nutritionFacts,
        nutritionFactInputs,
        nutrientDescriptions,
    );

    return (
        <div className={styles.mainBlock}>

            <RbaParametersBlock food={food} />

            <div className={styles.featuredNutritionFacts}>

                <RbaNutritionFactsBlock
                    isReadOnly={!food.editMode}
                    title={"NUTRITION FACTS"}
                    nutritionFacts={nutrients}
                />
            </div>
        </div>
    );
};

RbaGeneralInfoBlock.displayName = "RbaGeneralInfoBlock";

export default RbaGeneralInfoBlock;
