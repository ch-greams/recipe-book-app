
import type { Dispatch } from "react";
import React from "react";
import type { AnyAction } from "@reduxjs/toolkit";

import type { NutrientName } from "@common/nutrients";
import { NUTRIENT_TYPE_LABEL_MAPPING } from "@common/nutrients";
import { isSome } from "@common/types";
import type { InputChangeCallback } from "@common/typings";
import type { NutrientUnit } from "@common/units";
import Utils from "@common/utils";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { useAppDispatch } from "@store";
import { updateNutrient } from "@store/actions/food";

import styles from "./rba-nutrition-fact-line.module.scss";


export interface Nutrient {

    amount?: Option<number>;
    inputValue: string;
    type: NutrientName;
    unit: NutrientUnit;
    dailyValue?: Option<number>;
    isFraction: boolean;
}

interface Props {
    isReadOnly: boolean;
    nutrient: Nutrient;
}

const handleOnChange = (dispatch: Dispatch<AnyAction>, nutrient: Nutrient): InputChangeCallback => {

    return (event) => {

        const inputValue = Utils.decimalNormalizer((event.target.value || ""), nutrient.inputValue);

        dispatch(updateNutrient({ key: nutrient.type, value: inputValue }));
    };
};

const dailyValueBlock = (dailyValue: Option<number>): Option<JSX.Element> => {
    return (
        isSome(dailyValue)
            ? (
                <>
                    <div className={styles.nutrientDailyValue}>
                        {( dailyValue > Utils.MAX_DAILY_VALUE ? `${Utils.MAX_DAILY_VALUE}+` : dailyValue )}
                    </div>

                    <div className={styles.nutrientPercent}>
                        {"%"}
                    </div>
                </>
            )
            : null
    );
};


const RbaNutrientLine: React.FC<Props> = ({
    nutrient, isReadOnly,
}) => {

    // TODO: Move dispatch hook to RbaNutrientsBlock component (like custom-unit block & line)
    const dispatch = useAppDispatch();

    return (

        <div className={nutrient.isFraction ? styles.subNutrientLine : styles.nutrientLine}>

            <div className={styles.nutrientName}>
                {NUTRIENT_TYPE_LABEL_MAPPING[nutrient.type]}
            </div>

            <RbaInput
                disabled={isReadOnly}
                width={InputWidthSize.Medium}
                height={InputHeightSize.Small}
                theme={nutrient.isFraction ? InputTheme.Alternative : InputTheme.Primary}
                value={nutrient.inputValue}
                onChange={handleOnChange(dispatch, nutrient)}
            />

            <div className={styles.nutrientUnit}>
                {nutrient.unit}
            </div>

            { dailyValueBlock(nutrient.dailyValue) }

        </div>
    );
};

RbaNutrientLine.displayName = "RbaNutrientLine";

export default RbaNutrientLine;
