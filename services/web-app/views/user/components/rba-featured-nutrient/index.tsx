import React, { useState } from "react";

import { NutrientName } from "@common/nutrients";
import { NUTRIENT_TYPE_LABEL_MAPPING } from "@common/nutrients";
import { getValues, mapDictionary } from "@common/object";
import { isEnum, isSome, unwrapOr } from "@common/types";
import Utils from "@common/utils";
import RbaInput, { InputHeightSize, InputNormalizer, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaSelect, { getOptionLabel, SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import RbaToggle from "@views/shared/rba-toggle";

import styles from "./rba-featured-nutrient.module.scss";


interface Props {
    slotIndex: number;
    nutrientId?: Option<number>;
    nutrientName?: Option<string>;
    userDailyTargetAmount?: Option<string>;
    nutrientDailyTargetAmount?: Option<string>;
    nutrientUnit?: Option<string>;
    updateNutrient: (uiIndex: number, name: NutrientName, amount?: Option<number>) => void;
    deleteNutrient: (nutrientId: number) => void;
}

const RbaFeaturedNutrient: React.FC<Props> = ({
    slotIndex,
    nutrientId,
    nutrientName,
    userDailyTargetAmount,
    nutrientDailyTargetAmount,
    nutrientUnit,
    updateNutrient,
    deleteNutrient,
}) => {

    const [ amount, setAmount ] = useState(userDailyTargetAmount || "");

    const nutrientOptions = getValues(
        mapDictionary(NUTRIENT_TYPE_LABEL_MAPPING, (name, label) => ({ label, value: name })),
    );

    const hasNutrient = isSome(nutrientName) && isEnum<NutrientName, typeof NutrientName>(NutrientName, nutrientName);

    return (

        <div className={styles.nutrientLine}>

            <div className={styles.nutrient}>

                <span className={styles.nutrientIndex}>
                    {slotIndex}
                </span>

                <RbaSelect
                    theme={SelectTheme.Primary}
                    width={SelectWidthSize.Full}
                    height={SelectHeightSize.Medium}
                    value={(
                        isSome(nutrientName) && isEnum<NutrientName, typeof NutrientName>(NutrientName, nutrientName)
                            ? getOptionLabel({ label: NUTRIENT_TYPE_LABEL_MAPPING[nutrientName], value: nutrientName })
                            : undefined
                    )}
                    options={nutrientOptions}
                    onChange={(option) => {
                        if (isEnum<NutrientName, typeof NutrientName>(NutrientName, option.value)) {
                            updateNutrient(slotIndex, option.value, null);
                        }
                    }}
                />

                <RbaInput
                    theme={InputTheme.Primary}
                    align={InputTextAlign.Right}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Medium}
                    normalizer={InputNormalizer.Decimal}
                    placeholder={nutrientDailyTargetAmount || ""}
                    disabled={!hasNutrient}
                    value={amount}
                    onBlur={(value) => {
                        if (isSome(nutrientName) && isEnum<NutrientName, typeof NutrientName>(NutrientName, nutrientName)) {
                            updateNutrient(slotIndex, nutrientName, Utils.stringToNumber(value));
                        }
                    }}
                    onChange={(value) => setAmount(value)}
                />

                <span className={styles.nutrientUnit}>
                    {unwrapOr(nutrientUnit, "")}
                </span>

            </div>

            <RbaToggle
                value={hasNutrient}
                onToggle={() => {
                    if (isSome(nutrientId)) {
                        deleteNutrient(nutrientId);
                    }
                }}
            />

        </div>

    );
};


RbaFeaturedNutrient.displayName = "RbaFeaturedNutrient";

export default RbaFeaturedNutrient;
