
import React, { Dispatch } from "react";
import { useDispatch } from "react-redux";

import { nutritionFactTypeLabelMapping } from "@common/nutritionFacts";
import { InputChangeCallback, Option } from "@common/typings";
import Utils from "@common/utils";
import { updateNutritionFact } from "@store/food/actions";
import { UpdateNutritionFactAction } from "@store/food/types";

import { NutritionFact } from ".";

import styles from "./NutritionFactsBlockLine.module.scss";


interface NutritionFactsBlockLineProps {
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


const NutritionFactsBlockLine: React.FC<NutritionFactsBlockLineProps> = ({
    nutritionFact, isReadOnly,
}) => {

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

NutritionFactsBlockLine.displayName = "NutritionFactsBlockLine";

export default NutritionFactsBlockLine;
