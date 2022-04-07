import React from "react";

import BlockTitle from "@views/shared/block-title";

import styles from "./foods-block.module.scss";


// TODO: Replace it with real type
interface FoodItem {
    id: number;
    name: string;
}

interface FoodsBlockProps {
    foods: FoodItem[];
}


const FoodsBlock: React.FC<FoodsBlockProps> = ({ foods }) => {

    return (
        <div className={styles.foodsBlock}>

            <BlockTitle text={"Favorites"} />

            <div className={styles.itemList}>
                {foods.map((food) => (
                    <div key={food.id} className={styles.infoLine}>
                        {food.name}
                    </div>
                ))}
            </div>

            <BlockTitle text={"My Own"} />

            <div className={styles.itemList}>
                {foods.map((food) => (
                    <div key={food.id} className={styles.infoLine}>
                        {food.name}
                    </div>
                ))}
            </div>

        </div>
    );
};

FoodsBlock.displayName = "FoodsBlock";

export default FoodsBlock;
