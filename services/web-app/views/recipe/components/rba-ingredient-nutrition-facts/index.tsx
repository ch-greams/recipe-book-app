import React from "react";
import * as constants from "@cypress/constants";

import { NutritionFactType } from "@common/nutritionFacts";
import Utils from "@common/utils";

import styles from "./rba-ingredient-nutrition-facts.module.scss";


interface Props {
    nutritionFacts: Dictionary<NutritionFactType, number>;
    alternativeNutritionFacts?: Dictionary<NutritionFactType, number>;
}

/**
 * Select color for the nutrition fact value based on the difference between `current` and `alternative` value
 */
const getNutritionValueClass = (
    currentNutritionValue: Option<number>,
    alternativeNutritionValue: Option<number>,
): string => {
    if (Utils.isSome(currentNutritionValue) && Utils.isSome(alternativeNutritionValue)) {
        return (
            currentNutritionValue === alternativeNutritionValue
                ? styles.equalValue
                : ( currentNutritionValue > alternativeNutritionValue ? styles.increasedValue : styles.decreasedValue )
        );
    }
    else {
        return styles.equalValue;
    }
};

const RbaIngredientNutritionFacts: React.FC<Props> = ({ nutritionFacts, alternativeNutritionFacts = {} }) => {

    const nutritionFactTypes = [
        NutritionFactType.Carbohydrate,
        NutritionFactType.Fat,
        NutritionFactType.Protein,
        NutritionFactType.Energy,
    ];

    return (
        <div className={styles.ingredientNutritionFacts}>

            {nutritionFactTypes.map( (type) => (
                <div key={`nutritionFact_${type}`} className={styles.ingredientNutritionFact}>
                    <div
                        data-cy={constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}
                        className={[
                            styles.ingredientNutritionFactAmount,
                            getNutritionValueClass(nutritionFacts[type], alternativeNutritionFacts[type]),
                        ].join(" ")}
                    >
                        {( Utils.objectIsNotEmpty(alternativeNutritionFacts) ? alternativeNutritionFacts[type] : nutritionFacts[type] )}
                    </div>
                    <div
                        data-cy={constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}
                        className={styles.ingredientNutritionFactType}
                    >
                        {type.toUpperCase()}
                    </div>
                </div>
            ))}
        </div>
    );
};

RbaIngredientNutritionFacts.displayName = "RbaIngredientNutritionFacts";


export default RbaIngredientNutritionFacts;
