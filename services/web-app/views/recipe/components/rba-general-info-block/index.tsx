import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutrients";
import { getNutrients } from "@common/utils";
import RbaParametersBlock from "@views/recipe/components/rba-parameters-block";
import RbaNutrientsBlock from "@views/shared/rba-nutrients-block";
import type { RecipePageStore } from "@store/types/recipe";

import styles from "./rba-general-info-block.module.scss";



interface Props {
    recipe: RecipePageStore;
    featuredNutrients: NutrientName[];
    nutrients: Dictionary<NutrientName, number>;
    nutrientInputs: Dictionary<NutrientName, string>;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
    updateNutrient: (name: NutrientName, value: string) => void;
}

const RbaGeneralInfoBlock: React.FC<Props> = ({
    recipe, featuredNutrients, nutrients, nutrientInputs, nutrientDescriptions, updateNutrient,
}) => (
    <div className={styles.mainBlock}>

        <RbaParametersBlock recipe={recipe} />

        <div className={styles.featuredNutrients}>

            <RbaNutrientsBlock
                isReadOnly={!recipe.editMode}
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
