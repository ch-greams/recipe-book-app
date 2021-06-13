import React from "react";

import {
    CARBOHYDRATES_GROUP,
    LIPIDS_GROUP,
    MINERALS_GROUP,
    NutrientGroupType,
    NutritionFactType,
    OTHER_GROUP,
    PROTEINS_GROUP,
    VITAMINS_GROUP,
} from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import Utils from "@common/utils";
import NutritionFactsBlock from "@client/components/NutritionFactsBlock/NutritionFactsBlock";

import styles from "./PageDetailedNutritionFactsBlock.module.scss";



interface Props {
    isReadOnly?: boolean;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    nutritionFactInputs: Dictionary<NutritionFactType, string>;
}


const PageDetailedNutritionFactsBlock: React.FC<Props> = ({
    isReadOnly = false, nutritionFacts, nutritionFactInputs,
}) => {

    const leftColumn: [ NutrientGroupType, NutritionFactType[] ][] = [
        [ NutrientGroupType.Carbohydrates, CARBOHYDRATES_GROUP ],
        [ NutrientGroupType.Lipids, LIPIDS_GROUP ],
        [ NutrientGroupType.Proteins, PROTEINS_GROUP ],
    ];

    const rightColumn: [ NutrientGroupType, NutritionFactType[] ][] = [
        [ NutrientGroupType.Vitamins, VITAMINS_GROUP ],
        [ NutrientGroupType.Minerals, MINERALS_GROUP ],
        [ NutrientGroupType.Other, OTHER_GROUP ],
    ];

    return (
        <div className={styles.detailedNutritionFacts}>

            <div className={styles.detailedNutritionFactsColumn}>

                {leftColumn.map(([ type, group ]) => (
                    <NutritionFactsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutritionFacts={Utils.getNutritionFacts(group, nutritionFacts, nutritionFactInputs)}
                    />
                ))}

            </div>

            <div className={styles.detailedNutritionFactsColumn}>

                {rightColumn.map(([ type, group ]) => (
                    <NutritionFactsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutritionFacts={Utils.getNutritionFacts(group, nutritionFacts, nutritionFactInputs)}
                    />
                ))}

            </div>

        </div>
    );
};

PageDetailedNutritionFactsBlock.displayName = "PageDetailedNutritionFactsBlock";
export default PageDetailedNutritionFactsBlock;
