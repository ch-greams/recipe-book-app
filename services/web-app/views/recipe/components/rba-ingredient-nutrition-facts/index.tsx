import React from "react";
import * as constants from "@cypress/constants";

import { NutrientName } from "@common/nutrients";
import { classNames } from "@common/style";
import { isSome } from "@common/types";
import Utils from "@common/utils";

import styles from "./rba-ingredient-nutrition-facts.module.scss";


interface Props {
    nutrients: Dictionary<NutrientName, number>;
    alternativeNutrients?: Dictionary<NutrientName, number>;
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

const RbaIngredientNutrients: React.FC<Props> = ({ nutrients, alternativeNutrients = {} }) => {

    const nutrientTypes = [
        NutrientName.Carbohydrate,
        NutrientName.Fat,
        NutrientName.Protein,
        NutrientName.Energy,
    ];

    return (
        <div className={styles.ingredientNutrients}>

            {nutrientTypes.map( (type) => {

                const currentNutritionValue = nutrients[type];
                const alternativeNutritionValue = alternativeNutrients[type];

                const nutritionValue = getNutritionValue(
                    currentNutritionValue,
                    alternativeNutritionValue,
                    Utils.objectIsNotEmpty(alternativeNutrients),
                );

                const nutritionValueClass = getNutritionValueClass(currentNutritionValue, alternativeNutritionValue);

                return (
                    <div key={`nutrient_${type}`} className={styles.ingredientNutrient}>
                        <div
                            data-cy={constants.CY_INGREDIENT_NUTRIENT_AMOUNT}
                            className={classNames([ styles.ingredientNutrientAmount, nutritionValueClass ])}
                        >
                            {nutritionValue}
                        </div>
                        <div
                            data-cy={constants.CY_INGREDIENT_NUTRIENT_TYPE}
                            className={styles.ingredientNutrientType}
                        >
                            {type}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

RbaIngredientNutrients.displayName = "RbaIngredientNutrients";


export default RbaIngredientNutrients;
