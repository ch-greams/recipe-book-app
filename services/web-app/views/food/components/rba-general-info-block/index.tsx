import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutrients";
import { getNutrients } from "@common/utils";
import RbaParametersBlock from "@views/food/components/rba-parameters-block";
import RbaNutrientsBlock from "@views/shared/rba-nutrients-block";
import type { FoodPageStore } from "@store/types/food";

import styles from "./rba-general-info-block.module.scss";



interface Props {
    food: FoodPageStore;
    featuredNutrients: NutrientName[];
    nutrients: Dictionary<NutrientName, number>;
    nutrientInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
    updateNutrient: (name: NutrientName, value: string) => void;
}

const RbaGeneralInfoBlock: React.FC<Props> = ({
    food, featuredNutrients, nutrients, nutrientInputs, nutrientDescriptions, updateNutrient,
}) => (
    <div className={styles.mainBlock}>

        <RbaParametersBlock food={food} />

        <div className={styles.featuredNutrients}>

            <RbaNutrientsBlock
                isReadOnly={!food.editMode}
                title={"NUTRITION FACTS"}
                nutrients={getNutrients(
                    featuredNutrients,
                    nutrients,
                    nutrientInputs,
                    nutrientDescriptions,
                    true,
                )}
                updateNutrient={updateNutrient}
            />
        </div>
    </div>
);

RbaGeneralInfoBlock.displayName = "RbaGeneralInfoBlock";

export default RbaGeneralInfoBlock;
