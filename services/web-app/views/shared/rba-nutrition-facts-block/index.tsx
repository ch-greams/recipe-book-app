import React from "react";

import type { Nutrient } from "@views/shared/rba-nutrition-fact-line";
import RbaNutrientLine from "@views/shared/rba-nutrition-fact-line";

import styles from "./rba-nutrition-facts-block.module.scss";


interface Props {
    isReadOnly?: boolean;
    title: string;
    nutrients: Nutrient[];
}



const RbaNutrientsBlock: React.FC<Props> = ({
    isReadOnly = false, title, nutrients,
}) => {

    const nutrientLines = nutrients.map((nutrient) => (
        <RbaNutrientLine
            key={nutrient.type}
            nutrient={nutrient}
            isReadOnly={isReadOnly}
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
