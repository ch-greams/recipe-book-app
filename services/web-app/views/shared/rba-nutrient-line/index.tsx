import React from "react";

import type { NutrientName } from "@common/nutrients";
import { NUTRIENT_TYPE_LABEL_MAPPING } from "@common/nutrients";
import { isNone, isSome } from "@common/types";
import type { NutrientUnit } from "@common/units";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "@views/shared/rba-input";

import styles from "./rba-nutrient-line.module.scss";


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
    updateNutrient?: (name: NutrientName, value: string) => void;
}

const MAX_DAILY_VALUE: number = 999;

const dailyValueBlock = (dailyValue: Option<number>): Option<JSX.Element> => {
    return (
        isSome(dailyValue)
            ? (
                <>
                    <div className={styles.nutrientDailyValue}>
                        {( dailyValue > MAX_DAILY_VALUE ? `${MAX_DAILY_VALUE}+` : dailyValue )}
                    </div>

                    <div className={styles.nutrientPercent}>
                        {"%"}
                    </div>
                </>
            )
            : null
    );
};


const RbaNutrientLine: React.FC<Props> = ({ nutrient, isReadOnly, updateNutrient }) => {

    return (

        <div className={nutrient.isFraction ? styles.subNutrientLine : styles.nutrientLine}>

            <div className={styles.nutrientName}>
                {NUTRIENT_TYPE_LABEL_MAPPING[nutrient.type]}
            </div>

            <RbaInput
                disabled={isReadOnly || isNone(updateNutrient)}
                width={InputWidthSize.Medium}
                height={InputHeightSize.Small}
                theme={nutrient.isFraction ? InputTheme.Alternative : InputTheme.Primary}
                value={nutrient.inputValue}
                normalizer={InputNormalizer.Decimal}
                onChange={(value) => {
                    if (isSome(updateNutrient)) {
                        updateNutrient(nutrient.type, value);
                    }
                }}
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
