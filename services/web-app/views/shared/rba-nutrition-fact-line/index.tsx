
import type { Dispatch } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import type { NutritionFactType } from "@common/nutritionFacts";
import { nutritionFactTypeLabelMapping } from "@common/nutritionFacts";
import type { InputChangeCallback } from "@common/typings";
import type { NutritionFactUnit } from "@common/units";
import Utils from "@common/utils";
import { updateNutritionFact } from "@store/food/actions";
import type { UpdateNutritionFactAction } from "@store/food/types";

import styles from "./rba-nutrition-fact-line.module.scss";


export interface NutritionFact {

    amount?: Option<number>;
    inputValue: string;
    type: NutritionFactType;
    unit: NutritionFactUnit;
    dailyValue?: Option<number>;
    isFraction: boolean;
}

interface Props {
    isReadOnly: boolean;
    nutritionFact: NutritionFact;
}

const handleOnChange = (dispatch: Dispatch<UpdateNutritionFactAction>, nutritionFact: NutritionFact): InputChangeCallback => {

    return (event) => {

        const inputValue = Utils.decimalNormalizer((event.target.value || ""), nutritionFact.inputValue);

        dispatch(updateNutritionFact(nutritionFact.type, inputValue));
    };
};

const dailyValueBlock = (dailyValue: Option<number>): Option<JSX.Element> => {
    return (
        Utils.isSome(dailyValue)
            ? (
                <>
                    <div className={styles.nutritionFactDailyValue}>
                        {( dailyValue > Utils.MAX_DAILY_VALUE ? `${Utils.MAX_DAILY_VALUE}+` : dailyValue )}
                    </div>

                    <div className={styles.nutritionFactPercent}>
                        {"%"}
                    </div>
                </>
            )
            : null
    );
};


const RbaNutritionFactLine: React.FC<Props> = ({
    nutritionFact, isReadOnly,
}) => {

    // TODO: Move dispatch hook to RbaNutritionFactsBlock component (like custom-unit block & line)
    const dispatch = useDispatch();

    const nutritionFactAmountInput = (
        <input
            type={"text"}
            className={styles.nutritionFactAmountInput}
            value={(nutritionFact.inputValue || "")}
            onChange={handleOnChange(dispatch, nutritionFact)}
        />
    );

    const nutritionFactAmountText = (
        <div className={styles.nutritionFactAmountText}>
            {nutritionFact.inputValue}
        </div>
    );

    return (

        <div className={nutritionFact.isFraction ? styles.subNutrientLine : styles.nutritionFactLine}>

            <div className={styles.nutritionFactName}>
                {nutritionFactTypeLabelMapping[nutritionFact.type]}
            </div>

            {( isReadOnly ? nutritionFactAmountText : nutritionFactAmountInput )}

            <div className={styles.nutritionFactUnit}>
                {nutritionFact.unit}
            </div>

            { dailyValueBlock(nutritionFact.dailyValue) }

        </div>
    );
};

RbaNutritionFactLine.displayName = "RbaNutritionFactLine";

export default RbaNutritionFactLine;
