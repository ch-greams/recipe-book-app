import React from "react";

import { NUTRIENT_TYPE_LABEL_MAPPING, NutrientName } from "@common/nutrients";
import Utils from "@common/utils";
import RbaInput, { InputHeightSize, InputNormalizer, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaSelect, { getOptionLabel, SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import RbaToggle from "@views/shared/rba-toggle";

import styles from "./rba-featured-nutrient.module.scss";


interface Props {
    uiIndex: number;
    name: string;
    updateNutrient: (uiIndex: number, name: string) => void;
}

const RbaFeaturedNutrient: React.FC<Props> = ({ uiIndex, name, updateNutrient }) => {

    const nutrientOptions = Utils.getObjectValues(NutrientName)
        .map((nutrientName) => ({
            label: NUTRIENT_TYPE_LABEL_MAPPING[nutrientName],
            value: nutrientName,
        }));

    return (

        <div className={styles.nutrientLine}>

            <div className={styles.nutrient}>

                <span className={styles.nutrientIndex}>
                    {uiIndex}
                </span>

                <RbaSelect
                    theme={SelectTheme.Primary}
                    width={SelectWidthSize.Full}
                    height={SelectHeightSize.Medium}
                    value={getOptionLabel({
                        label: NUTRIENT_TYPE_LABEL_MAPPING[name as NutrientName],
                        value: name,
                    })}
                    options={nutrientOptions}
                    onChange={(option) => { console.log("option", option); }}
                />

                <RbaInput
                    theme={InputTheme.Primary}
                    align={InputTextAlign.Right}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Medium}
                    normalizer={InputNormalizer.Decimal}
                    value={"12.34"}
                    onChange={(value) => { updateNutrient(uiIndex, value); }}
                />

                <span className={styles.nutrientUnit}>
                    {"mcg"}
                </span>

            </div>

            <RbaToggle
                value={!Utils.isEmptyString(name)}
                onToggle={() => updateNutrient(uiIndex, "")}
            />

        </div>

    );
};


RbaFeaturedNutrient.displayName = "RbaFeaturedNutrient";

export default RbaFeaturedNutrient;
