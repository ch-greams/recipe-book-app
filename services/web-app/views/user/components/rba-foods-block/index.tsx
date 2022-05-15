import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import Utils, { RoutePath } from "@common/utils";
import RbaBlockTitle from "@views/shared/rba-block-title";

import styles from "./rba-foods-block.module.scss";


// TODO: Replace it with real type
interface FoodItem {
    id: number;
    name: string;
}

interface Props {
    favoriteFoods: FoodItem[];
    customFoods: FoodItem[];
}


const RbaFoodsBlock: React.FC<Props> = ({ favoriteFoods, customFoods }) => {

    return (
        <div className={styles.foodsBlock}>

            <RbaBlockTitle text={"Favorites"} />

            <div className={styles.itemList}>
                {favoriteFoods.map((food) => (
                    <Link key={food.id} href={Utils.getItemPath(RoutePath.Food, food.id)}>
                        <div data-cy={constants.CY_USER_FOOD_FAVORITE_ITEM} className={styles.infoLine}>
                            {food.name}
                        </div>
                    </Link>
                ))}
            </div>

            <RbaBlockTitle text={"My Own"} />

            <div className={styles.itemList}>
                {customFoods.map((food) => (
                    <Link key={food.id} href={Utils.getItemPath(RoutePath.Food, food.id)}>
                        <div data-cy={constants.CY_USER_FOOD_CUSTOM_ITEM} className={styles.infoLine}>
                            {food.name}
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

RbaFoodsBlock.displayName = "RbaFoodsBlock";

export default RbaFoodsBlock;
