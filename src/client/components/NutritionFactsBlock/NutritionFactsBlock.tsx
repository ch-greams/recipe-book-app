import React from "react";

import { NutritionFactType } from "@common/nutritionFacts";
import { NutritionFactUnit } from "@common/units";

import NutritionFactsBlockLine from "./NutritionFactsBlockLine";

import styles from "./NutritionFactsBlock.scss";

export interface NutritionFact {

    amount: number;
    inputValue: string;
    type: NutritionFactType;
    unit: NutritionFactUnit;
    dailyValue?: number;
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
