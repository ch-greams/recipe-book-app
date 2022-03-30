import React from "react";

import type { NutritionFactType } from "@common/nutritionFacts";
import {
    LipidNutritionFactType,
    MineralNutritionFactType,
    OtherNutritionFactType,
    ProteinNutritionFactType,
    VitaminNutritionFactType,
} from "@common/nutritionFacts";
import {
    CarbohydrateNutritionFactType,
    NutrientGroupType,
} from "@common/nutritionFacts";
import Utils from "@common/utils";
import NutritionFactsBlock from "@views/shared/nutrition-facts-block";

import styles from "./page-detailed-nutrition-facts-block.module.scss";



interface Props {
    isReadOnly?: boolean;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    nutritionFactInputs: Dictionary<NutritionFactType, string>;
}


const PageDetailedNutritionFactsBlock: React.FC<Props> = ({
    isReadOnly = false, nutritionFacts, nutritionFactInputs,
}) => {

    const leftColumn: [ NutrientGroupType, NutritionFactType[] ][] = [
        [ NutrientGroupType.Carbohydrates, Object.values(CarbohydrateNutritionFactType) ],
        [ NutrientGroupType.Lipids, Object.values(LipidNutritionFactType) ],
        [ NutrientGroupType.Proteins, Object.values(ProteinNutritionFactType) ],
    ];

    const rightColumn: [ NutrientGroupType, NutritionFactType[] ][] = [
        [ NutrientGroupType.Vitamins, Object.values(VitaminNutritionFactType) ],
        [ NutrientGroupType.Minerals, Object.values(MineralNutritionFactType) ],
        [ NutrientGroupType.Other, Object.values(OtherNutritionFactType) ],
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
