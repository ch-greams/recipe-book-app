import React from "react";
import * as constants from "@cypress/constants";

import { NutritionFactType } from "@common/nutritionFacts";
import { isSome } from "@common/types";
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
    if (isSome(currentNutritionValue) && isSome(alternativeNutritionValue)) {
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


/**
 * @returns If value nutrition value exist number will be returned, if not then it falls back to string constant
 */
const getNutritionValue = (
    currentNutritionValue: Option<number>,
    alternativeNutritionValue: Option<number>,
    isAlternative: boolean,
): string | number => {
    const DEFAULT_VALUE: string = "-";

    return (
        isAlternative
            ? ( isSome(alternativeNutritionValue) ? alternativeNutritionValue : DEFAULT_VALUE )
            : ( isSome(currentNutritionValue) ? currentNutritionValue : DEFAULT_VALUE )
    );
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

            {nutritionFactTypes.map( (type) => {

                const currentNutritionValue = nutritionFacts[type];
                const alternativeNutritionValue = alternativeNutritionFacts[type];

                const nutritionValue = getNutritionValue(
                    currentNutritionValue,
                    alternativeNutritionValue,
                    Utils.objectIsNotEmpty(alternativeNutritionFacts),
                );

                const nutritionValueClass = getNutritionValueClass(currentNutritionValue, alternativeNutritionValue);

                return (
                    <div key={`nutritionFact_${type}`} className={styles.ingredientNutritionFact}>
                        <div
                            data-cy={constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}
                            className={[ styles.ingredientNutritionFactAmount, nutritionValueClass ].join(" ")}
                        >
                            {nutritionValue}
                        </div>
                        <div
                            data-cy={constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}
                            className={styles.ingredientNutritionFactType}
                        >
                            {type}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

RbaIngredientNutritionFacts.displayName = "RbaIngredientNutritionFacts";


export default RbaIngredientNutritionFacts;
