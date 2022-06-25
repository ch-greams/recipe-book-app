import React from "react";

import type { NutritionFact } from "@views/shared/rba-nutrition-fact-line";
import RbaNutritionFactLine from "@views/shared/rba-nutrition-fact-line";

import styles from "./rba-nutrition-facts-block.module.scss";


interface Props {
    isReadOnly?: boolean;
    title: string;
    nutritionFacts: NutritionFact[];
}



const RbaNutritionFactsBlock: React.FC<Props> = ({
    isReadOnly = false, title, nutritionFacts,
}) => {

    const nutritionFactLines = nutritionFacts.map((nutritionFact) => (
        <RbaNutritionFactLine
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


RbaNutritionFactsBlock.displayName = "RbaNutritionFactsBlock";

export default RbaNutritionFactsBlock;
