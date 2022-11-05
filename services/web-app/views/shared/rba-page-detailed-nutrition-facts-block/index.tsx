import React from "react";

import type { NutrientDescription, NutrientName } from "@common/nutrients";
import {
    CarbohydrateNutrients, LipidNutrients, MineralNutrients, NutrientGroupType,
    OtherNutrients, ProteinNutrients, VitaminNutrients,
} from "@common/nutrients";
import Utils from "@common/utils";
import RbaNutrientsBlock from "@views/shared/rba-nutrition-facts-block";

import styles from "./rba-page-detailed-nutrition-facts-block.module.scss";



interface Props {
    isReadOnly?: boolean;
    nutrients: Dictionary<NutrientName, number>;
    nutrientInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}


const RbaPageDetailedNutrientsBlock: React.FC<Props> = ({
    isReadOnly = false, nutrients, nutrientInputs, nutrientDescriptions,
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
        <div className={styles.detailedNutrients}>

            <div className={styles.detailedNutrientsColumn}>

                {leftColumn.map(([ type, group ]) => (
                    <RbaNutrientsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutrients={Utils.getNutrients(
                            group, nutrients, nutrientInputs, nutrientDescriptions,
                        )}
                    />
                ))}

            </div>

            <div className={styles.detailedNutrientsColumn}>

                {rightColumn.map(([ type, group ]) => (
                    <RbaNutrientsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutrients={Utils.getNutrients(
                            group, nutrients, nutrientInputs, nutrientDescriptions,
                        )}
                    />
                ))}

            </div>

        </div>
    );
};

RbaPageDetailedNutrientsBlock.displayName = "RbaPageDetailedNutrientsBlock";
export default RbaPageDetailedNutrientsBlock;
