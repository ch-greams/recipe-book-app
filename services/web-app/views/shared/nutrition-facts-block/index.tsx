import React from "react";

import type { NutritionFactType } from "@common/nutritionFacts";
import type { NutritionFactUnit } from "@common/units";

import NutritionFactsBlockLine from "./nutrition-facts-block-line";

import styles from "./nutrition-facts-block.module.scss";

export interface NutritionFact {

    amount?: Option<number>;
    inputValue: string;
    type: NutritionFactType;
    unit: NutritionFactUnit;
    dailyValue?: Option<number>;
    isFraction: boolean;
}


interface NutritionFactsBlockProps {
    isReadOnly?: boolean;
    title: string;
    nutritionFacts: NutritionFact[];
}



const NutritionFactsBlock: React.FC<NutritionFactsBlockProps> = ({
    isReadOnly = false, title, nutritionFacts,
}) => {

    const nutritionFactLines = nutritionFacts.map((nutritionFact) => (
        <NutritionFactsBlockLine
            key={nutritionFact.type}
            nutritionFact={nutritionFact}
            isReadOnly={isReadOnly}
        />
    ));

    return (

        <div className={styles.nutritionFactsBlock}>

            <div className={styles.nutritionFactsBlockTitle}>
                {title}
            </div>

            {nutritionFactLines}

        </div>
    );
};


NutritionFactsBlock.displayName = "NutritionFactsBlock";

export default NutritionFactsBlock;
