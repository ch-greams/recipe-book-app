
import type { Dispatch } from "react";
import React from "react";
import type { AnyAction } from "@reduxjs/toolkit";

import type { NutritionFactType } from "@common/nutritionFacts";
import { nutritionFactTypeLabelMapping } from "@common/nutritionFacts";
import { isSome } from "@common/types";
import type { InputChangeCallback } from "@common/typings";
import type { NutritionFactUnit } from "@common/units";
import Utils from "@common/utils";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { useAppDispatch } from "@store";
import { updateNutritionFact } from "@store/actions/food";

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

const handleOnChange = (dispatch: Dispatch<AnyAction>, nutritionFact: NutritionFact): InputChangeCallback => {

    return (event) => {

        const inputValue = Utils.decimalNormalizer((event.target.value || ""), nutritionFact.inputValue);

        dispatch(updateNutritionFact({ key: nutritionFact.type, value: inputValue }));
    };
};

const dailyValueBlock = (dailyValue: Option<number>): Option<JSX.Element> => {
    return (
        isSome(dailyValue)
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
    const dispatch = useAppDispatch();

    return (

        <div className={nutritionFact.isFraction ? styles.subNutrientLine : styles.nutritionFactLine}>

            <div className={styles.nutritionFactName}>
                {nutritionFactTypeLabelMapping[nutritionFact.type]}
            </div>

            <RbaInput
                disabled={isReadOnly}
                width={InputWidthSize.Medium}
                height={InputHeightSize.Small}
                theme={nutritionFact.isFraction ? InputTheme.Alternative : InputTheme.Primary}
                value={nutritionFact.inputValue}
                onChange={handleOnChange(dispatch, nutritionFact)}
            />

            <div className={styles.nutritionFactUnit}>
                {nutritionFact.unit}
            </div>

            { dailyValueBlock(nutritionFact.dailyValue) }

        </div>
    );
};

RbaNutritionFactLine.displayName = "RbaNutritionFactLine";

export default RbaNutritionFactLine;
