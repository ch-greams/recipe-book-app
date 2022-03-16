import React from "react";

import { NutritionFactType } from "@common/nutritionFacts";
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

            {nutritionFactTypes.map( (type) => {

                const curNutritionValue: Option<number> = nutritionFacts[type];
                const altNutritionValue: Option<number> = altNutritionFacts[type];

                return (
                    <div
                        key={`nutritionFact_${type}`}
                        className={styles.ingredientInfoLineNutritionFact}
                    >
                        <div
                            className={styles.ingredientInfoLineNutritionFactAmount}
                            style={(
                                Utils.isSome(curNutritionValue) && Utils.isSome(altNutritionValue)
                                    ? { color: (curNutritionValue > altNutritionValue) ? Utils.COLOR_ALTERNATIVE : Utils.COLOR_DEFAULT_DARK }
                                    : undefined
                            )}
                        >
                            {( Utils.objectIsNotEmpty(altNutritionFacts) ? altNutritionFacts[type] : nutritionFacts[type] )}
                        </div>
                        <div className={styles.ingredientInfoLineNutritionFactType}>
                            {type.toUpperCase()}
                        </div>
                    </div>
                );
            } )}
        </div>
    );
};

IngredientInfoLineNutritionFacts.displayName = "IngredientInfoLineNutritionFacts";


export default IngredientInfoLineNutritionFacts;
