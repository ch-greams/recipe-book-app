import React from "react";

import { numberToString } from "@common/numeric";
import type { NutrientDescription } from "@common/nutrients";
import { NutrientName } from "@common/nutrients";
import { isEnum, isSome } from "@common/types";
import type { UserNutrient } from "@common/typings";
import type { UserStoreNutrient } from "@store/types/user";

import RbaFeaturedNutrient from "../rba-featured-nutrient";

import styles from "./rba-featured-nutrients-block.module.scss";


interface Props {
    userNutrients: UserStoreNutrient[];
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
    updateNutrient: (nutrient: UserNutrient) => void;
    deleteNutrient: (nutrientId: number) => void;
}

const RbaFeaturedNutrientsBlock: React.FC<Props> = ({
    userNutrients,
    nutrientDescriptions,
    updateNutrient,
    deleteNutrient,
}) => {

    const featuredNutrientSlots = Array.from({ length: 10 }).map((_empty, index) => {

        const slotIndex = index + 1;
        const userNutrient = userNutrients.find((nutrient) => nutrient.uiIndex === slotIndex);

        if (isSome(userNutrient) && isEnum<NutrientName, typeof NutrientName>(NutrientName, userNutrient.nutrientName)) {

            return (
                <RbaFeaturedNutrient
                    key={slotIndex}
                    slotIndex={slotIndex}
                    nutrientId={userNutrient.nutrientId}
                    nutrientName={userNutrient.nutrientName}
                    userDailyTargetAmount={numberToString(userNutrient.userDailyTargetAmount)}
                    nutrientDailyTargetAmount={numberToString(userNutrient.nutrientDailyTargetAmount)}
                    nutrientUnit={userNutrient.nutrientUnit}
                    updateNutrient={(uiIndex, name, amount) => {
                        updateNutrient({
                            user_id: 1,
                            nutrient_id: nutrientDescriptions[name].id,
                            is_featured: true,
                            daily_target_amount: amount,
                            ui_index: uiIndex,
                        });
                    }}
                    deleteNutrient={deleteNutrient}
                />
            );
        }
        else {
            return (
                <RbaFeaturedNutrient
                    key={slotIndex}
                    slotIndex={slotIndex}
                    updateNutrient={(uiIndex, name, amount) => {
                        updateNutrient({
                            user_id: 1,
                            nutrient_id: nutrientDescriptions[name].id,
                            is_featured: true,
                            daily_target_amount: amount,
                            ui_index: uiIndex,
                        });
                    }}
                    deleteNutrient={deleteNutrient}
                />
            );
        }
    });

    return (
        <div className={styles.nutrientsBlock}>

            {featuredNutrientSlots}

        </div>
    );
};


RbaFeaturedNutrientsBlock.displayName = "RbaFeaturedNutrientsBlock";

export default RbaFeaturedNutrientsBlock;
