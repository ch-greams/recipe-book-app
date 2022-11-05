import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutrients";
import Utils from "@common/utils";
import RbaParametersBlock from "@views/recipe/components/rba-parameters-block";
import RbaNutrientsBlock from "@views/shared/rba-nutrition-facts-block";
import type { RecipePageStore } from "@store/types/recipe";

import styles from "./rba-general-info-block.module.scss";



interface GeneralInfoBlockProps {
    recipe: RecipePageStore;
    featuredNutrients: NutrientName[];
    nutrients: Dictionary<NutrientName, number>;
    nutrientInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}

const RbaGeneralInfoBlock: React.FC<GeneralInfoBlockProps> = ({
    recipe, featuredNutrients, nutrients, nutrientInputs, nutrientDescriptions,
}) => (
    <div className={styles.mainBlock}>

        <RbaParametersBlock recipe={recipe} />

        <div className={styles.featuredNutrients}>

            <RbaNutrientsBlock
                isReadOnly={true}
                title={"NUTRITION FACTS"}
                nutrients={Utils.getNutrients(
                    featuredNutrients,
                    nutrients,
                    nutrientInputs,
                    nutrientDescriptions,
                )}
            />
        </div>
    </div>
);

RbaGeneralInfoBlock.displayName = "RbaGeneralInfoBlock";

export default RbaGeneralInfoBlock;
