import React from "react";

import type { NutrientName } from "@common/nutrients";
import type { Nutrient } from "@views/shared/rba-nutrient-line";
import RbaNutrientLine from "@views/shared/rba-nutrient-line";

import styles from "./rba-nutrients-block.module.scss";


interface Props {
    isReadOnly?: boolean;
    title: string;
    nutrients: Nutrient[];
    updateNutrient?: (name: NutrientName, value: string) => void;
}



const RbaNutrientsBlock: React.FC<Props> = ({ isReadOnly = false, title, nutrients, updateNutrient }) => {

    const nutrientLines = nutrients.map((nutrient) => (
        <RbaNutrientLine
            key={nutrient.type}
            nutrient={nutrient}
            isReadOnly={isReadOnly}
            updateNutrient={updateNutrient}
        />
    ));

    return (

        <div className={styles.nutrientsBlock}>

            <div className={styles.nutrientsBlockTitle}>
                {title}
            </div>

            {nutrientLines}

        </div>
    );
};


RbaNutrientsBlock.displayName = "RbaNutrientsBlock";

export default RbaNutrientsBlock;
