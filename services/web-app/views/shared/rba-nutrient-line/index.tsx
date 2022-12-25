import React from "react";

import type { NutrientName } from "@common/nutrients";
import { NUTRIENT_TYPE_LABEL_MAPPING } from "@common/nutrients";
import { isSome } from "@common/types";
import type { NutrientUnit } from "@common/units";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { useAppDispatch } from "@store";
import { updateNutrient } from "@store/actions/food";

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


const RbaNutrientLine: React.FC<Props> = ({ nutrient, isReadOnly }) => {

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
                normalizer={InputNormalizer.Decimal}
                onChange={(value) => { dispatch(updateNutrient({ key: nutrient.type, value: value })); }}
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
