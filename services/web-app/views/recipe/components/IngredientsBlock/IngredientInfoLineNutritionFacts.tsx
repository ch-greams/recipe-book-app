import React from "react";

import { NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import Utils from "@common/utils";

import styles from "./IngredientsBlock.module.scss";


interface IngredientInfoLineNutritionFactsProps {
    nutritionFacts: Dictionary<NutritionFactType, number>;
    altNutritionFacts?: Dictionary<NutritionFactType, number>;
}

const IngredientInfoLineNutritionFacts: React.FC<IngredientInfoLineNutritionFactsProps> = ({
    nutritionFacts, altNutritionFacts = {},
}) => {

    const nutritionFactTypes = [
        NutritionFactType.Carbohydrate,
        NutritionFactType.Fat,
        NutritionFactType.Protein,
        NutritionFactType.Energy,
    ];

    return (
        <div className={styles.ingredientInfoLineNutritionFacts}>

            {nutritionFactTypes.map( (type) => (
                <div
                    key={`nutritionFact_${type}`}
                    className={styles.ingredientInfoLineNutritionFact}
                >
                    <div
                        className={styles.ingredientInfoLineNutritionFactAmount}
                        style={(
                            Utils.objectIsNotEmpty(altNutritionFacts)
                                ? { color: (nutritionFacts[type] > altNutritionFacts[type]) ? "#ff6e40" : "#008e76" }
                                : undefined
                        )}
                    >
                        {( Utils.objectIsNotEmpty(altNutritionFacts) ? altNutritionFacts[type] : nutritionFacts[type] )}
                    </div>
                    <div className={styles.ingredientInfoLineNutritionFactType}>
                        {type.toUpperCase()}
                    </div>
                </div>
            ) )}
        </div>
    );
};

IngredientInfoLineNutritionFacts.displayName = "IngredientInfoLineNutritionFacts";


export default IngredientInfoLineNutritionFacts;
