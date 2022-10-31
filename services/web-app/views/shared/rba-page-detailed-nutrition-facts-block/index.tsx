import React from "react";

import type { NutrientDescription, NutrientName } from "@common/nutritionFacts";
import {
    CarbohydrateNutrients, LipidNutrients, MineralNutrients, NutrientGroupType,
    OtherNutrients, ProteinNutrients, VitaminNutrients,
} from "@common/nutritionFacts";
import Utils from "@common/utils";
import RbaNutritionFactsBlock from "@views/shared/rba-nutrition-facts-block";

import styles from "./rba-page-detailed-nutrition-facts-block.module.scss";



interface Props {
    isReadOnly?: boolean;
    nutritionFacts: Dictionary<NutrientName, number>;
    nutritionFactInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}


const RbaPageDetailedNutritionFactsBlock: React.FC<Props> = ({
    isReadOnly = false, nutritionFacts, nutritionFactInputs, nutrientDescriptions,
}) => {

    const leftColumn: [ NutrientGroupType, NutrientName[] ][] = [
        [ NutrientGroupType.Carbohydrates, CarbohydrateNutrients ],
        [ NutrientGroupType.Lipids, LipidNutrients ],
        [ NutrientGroupType.Proteins, ProteinNutrients ],
    ];

    const rightColumn: [ NutrientGroupType, NutrientName[] ][] = [
        [ NutrientGroupType.Vitamins, VitaminNutrients ],
        [ NutrientGroupType.Minerals, MineralNutrients ],
        [ NutrientGroupType.Other, OtherNutrients ],
    ];

    return (
        <div className={styles.detailedNutritionFacts}>

            <div className={styles.detailedNutritionFactsColumn}>

                {leftColumn.map(([ type, group ]) => (
                    <RbaNutritionFactsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutritionFacts={Utils.getNutritionFacts(
                            group, nutritionFacts, nutritionFactInputs, nutrientDescriptions,
                        )}
                    />
                ))}

            </div>

            <div className={styles.detailedNutritionFactsColumn}>

                {rightColumn.map(([ type, group ]) => (
                    <RbaNutritionFactsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutritionFacts={Utils.getNutritionFacts(
                            group, nutritionFacts, nutritionFactInputs, nutrientDescriptions,
                        )}
                    />
                ))}

            </div>

        </div>
    );
};

RbaPageDetailedNutritionFactsBlock.displayName = "RbaPageDetailedNutritionFactsBlock";
export default RbaPageDetailedNutritionFactsBlock;
