import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { BUTTON_DELETE } from "@common/labels";
import { getProductPath } from "@common/routes";
import type { FoodShort } from "@common/typings";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaButton, { ButtonHeightSize, ButtonWidthSize } from "@views/shared/rba-button";

import styles from "./rba-foods-block.module.scss";



interface Props {
    favoriteFoods: FoodShort[];
    customFoods: FoodShort[];
    deleteFavoriteFood: (foodId: number) => void;
    deleteCustomFood: (foodId: number) => void;
}


const RbaFoodsBlock: React.FC<Props> = ({ favoriteFoods, customFoods, deleteFavoriteFood, deleteCustomFood }) => {

    return (
        <div className={styles.foodsBlock}>

            <RbaBlockTitle text={"Favorites"} />

            <div className={styles.foodList}>
                {favoriteFoods.map((food) => (
                    <div key={food.id} className={styles.foodLine}>
                        <Link href={getProductPath(false, food.id)}>
                            <div data-cy={constants.CY_USER_FOOD_FAVORITE_ITEM} className={styles.foodName}>
                                {food.is_recipe ? "* " : ""}{food.name}
                            </div>
                        </Link>

                        <RbaButton
                            label={BUTTON_DELETE}
                            width={ButtonWidthSize.Full}
                            height={ButtonHeightSize.Full}
                            onClick={() => { deleteFavoriteFood(food.id); }}
                        />
                    </div>
                ))}
            </div>

            <RbaBlockTitle text={"My Own"} />

            <div className={styles.foodList}>
                {customFoods.map((food) => (
                    <div key={food.id} className={styles.foodLine}>
                        <Link href={getProductPath(false, food.id)}>
                            <div data-cy={constants.CY_USER_FOOD_CUSTOM_ITEM} className={styles.foodName}>
                                {food.is_recipe ? "* " : ""}{food.name}
                            </div>
                        </Link>

                        <RbaButton
                            label={BUTTON_DELETE}
                            width={ButtonWidthSize.Full}
                            height={ButtonHeightSize.Full}
                            onClick={() => { deleteCustomFood(food.id); }}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

RbaFoodsBlock.displayName = "RbaFoodsBlock";

export default RbaFoodsBlock;
