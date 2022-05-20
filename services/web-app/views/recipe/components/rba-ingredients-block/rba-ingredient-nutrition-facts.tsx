import React from "react";
import * as constants from "@cypress/constants";

import { NutritionFactType } from "@common/nutritionFacts";
import Utils from "@common/utils";

import styles from "./rba-ingredients-block.module.scss";


interface Props {
    nutritionFacts: Dictionary<NutritionFactType, number>;
    altNutritionFacts?: Dictionary<NutritionFactType, number>;
}

const RbaIngredientNutritionFacts: React.FC<Props> = ({
    nutritionFacts, altNutritionFacts: alternativeNutritionFacts = {},
}) => {

    const nutritionFactTypes = [
        NutritionFactType.Carbohydrate,
        NutritionFactType.Fat,
        NutritionFactType.Protein,
        NutritionFactType.Energy,
    ];

    return (
        <div className={styles.ingredientNutritionFacts}>

            {nutritionFactTypes.map( (type) => {

                const curNutritionValue: Option<number> = nutritionFacts[type];
                const altNutritionValue: Option<number> = alternativeNutritionFacts[type];

                return (
                    <div
                        key={`nutritionFact_${type}`}
                        className={styles.ingredientInfoLineNutritionFact}
                    >
                        <div
                            data-cy={constants.CY_INGREDIENT_INFO_LINE_NF_AMOUNT}
                            className={styles.ingredientInfoLineNutritionFactAmount}
                            // FIXME: NO STYLES!
                            style={(
                                Utils.isSome(curNutritionValue) && Utils.isSome(altNutritionValue)
                                    ? { color: (curNutritionValue > altNutritionValue) ? Utils.COLOR_ALTERNATIVE : Utils.COLOR_DEFAULT_DARK }
                                    : undefined
                            )}
                        >
                            {( Utils.objectIsNotEmpty(alternativeNutritionFacts) ? alternativeNutritionFacts[type] : nutritionFacts[type] )}
                        </div>
                        <div
                            data-cy={constants.CY_INGREDIENT_INFO_LINE_NF_TYPE}
                            className={styles.ingredientInfoLineNutritionFactType}
                        >
                            {type.toUpperCase()}
                        </div>
                    </div>
                );
            } )}
        </div>
    );
};

RbaIngredientNutritionFacts.displayName = "RbaIngredientNutritionFacts";


export default RbaIngredientNutritionFacts;
