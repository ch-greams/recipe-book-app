import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutrients";
import Utils from "@common/utils";
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
}

const RbaGeneralInfoBlock: React.FC<Props> = ({
    food, featuredNutrients, nutrients, nutrientInputs, nutrientDescriptions,
}) => (
    <div className={styles.mainBlock}>

        <RbaParametersBlock food={food} />

        <div className={styles.featuredNutrients}>

            <RbaNutrientsBlock
                isReadOnly={!food.editMode}
                title={"NUTRITION FACTS"}
                nutrients={Utils.getNutrients(
                    featuredNutrients,
                    nutrients,
                    nutrientInputs,
                    nutrientDescriptions,
                    true,
                )}
            />
        </div>
    </div>
);

RbaGeneralInfoBlock.displayName = "RbaGeneralInfoBlock";

export default RbaGeneralInfoBlock;
