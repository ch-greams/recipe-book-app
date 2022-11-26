import React from "react";

import type { NutrientDescription,NutrientName } from "@common/nutrients";
import { isSome } from "@common/types";
import type { UserStoreNutrient } from "@store/types/user";

import RbaFeaturedNutrient from "../rba-featured-nutrient";

import styles from "./rba-featured-nutrients-block.module.scss";


interface Props {
    userNutrients: UserStoreNutrient[];
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}

const RbaFeaturedNutrientsBlock: React.FC<Props> = ({ userNutrients }) => {


    const featuredNutrientSlots = Array.from({ length: 10 }).map((_empty, index) => {

        const slotIndex = index + 1;

        const userNutrient = userNutrients.find((nutrient) => nutrient.uiIndex === slotIndex);

        const nutrientName = isSome(userNutrient) ? userNutrient.nutrientName : "empty";

        return (
            <RbaFeaturedNutrient
                key={slotIndex}
                uiIndex={slotIndex}
                name={nutrientName}
                updateNutrient={(uiIndex, name) => console.log("RbaFeaturedNutrient update", { uiIndex, name })}
            />
        );
    });

    return (
        <div className={styles.nutrientsBlock}>

            {featuredNutrientSlots}

        </div>
    );
};


RbaFeaturedNutrientsBlock.displayName = "RbaFeaturedNutrientsBlock";

export default RbaFeaturedNutrientsBlock;
