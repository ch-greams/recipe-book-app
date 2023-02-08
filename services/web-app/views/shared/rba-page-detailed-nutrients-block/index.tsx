import React from "react";
import * as constants from "@cypress/constants";

import type { NutrientDescription, NutrientName } from "@common/nutrients";
import {
    CarbohydrateNutrients, LipidNutrients, MineralNutrients, NutrientGroupType,
    OtherNutrients, ProteinNutrients, VitaminNutrients,
} from "@common/nutrients";
import { getNutrients } from "@common/utils";
import RbaNutrientsBlock from "@views/shared/rba-nutrients-block";

import styles from "./rba-page-detailed-nutrients-block.module.scss";



interface Props {
    isReadOnly?: boolean;
    nutrients: Dictionary<NutrientName, number>;
    nutrientInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
    updateNutrient?: (name: NutrientName, value: string) => void;
}


const RbaPageDetailedNutrientsBlock: React.FC<Props> = ({
    isReadOnly = false, nutrients, nutrientInputs, nutrientDescriptions, updateNutrient,
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
        <div className={styles.detailedNutrients} data-cy={constants.CY_DETAILED_NUTRIENTS_BLOCK}>

            <div className={styles.detailedNutrientsColumn}>

                {leftColumn.map(([ type, group ]) => (
                    <RbaNutrientsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutrients={getNutrients(group, nutrients, nutrientInputs, nutrientDescriptions)}
                        updateNutrient={updateNutrient}
                    />
                ))}

            </div>

            <div className={styles.detailedNutrientsColumn}>

                {rightColumn.map(([ type, group ]) => (
                    <RbaNutrientsBlock
                        key={type}
                        isReadOnly={isReadOnly}
                        title={type}
                        nutrients={getNutrients(group, nutrients, nutrientInputs, nutrientDescriptions)}
                        updateNutrient={updateNutrient}
                    />
                ))}

            </div>

        </div>
    );
};

RbaPageDetailedNutrientsBlock.displayName = "RbaPageDetailedNutrientsBlock";
export default RbaPageDetailedNutrientsBlock;
