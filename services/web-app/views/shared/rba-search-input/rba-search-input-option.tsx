import React from "react";
import Link from "next/link";

import { FOOD, RECIPE } from "@common/labels";
import { getFoodPath } from "@common/routes";
import { isSome } from "@common/types";
import type { FoodShort } from "@common/typings";

import type { OnSelectFunc } from ".";

import styles from "./rba-search-input.module.scss";


interface Props {
    food: FoodShort;
    onSelect?: Option<OnSelectFunc>;
}


const getLink = (food: FoodShort): JSX.Element => (
    <Link
        key={food.id}
        href={getFoodPath(food.is_recipe, food.id)}
    >
        <a className={styles.searchOption}>
            <span>
                {food.name}
            </span>
            <span className={styles.searchOptionType}>
                {food.is_recipe ? RECIPE : FOOD}
            </span>
        </a>
    </Link>
);

const getButton = (food: FoodShort, onSelect: OnSelectFunc): JSX.Element => (
    <button type={"button"} onClick={() => onSelect(food)} className={styles.searchOption}>
        <span>
            {food.name}
        </span>
        <span className={styles.searchOptionType}>
            {food.is_recipe ? RECIPE : FOOD}
        </span>
    </button>
);

const RbaSearchInputOption: React.FC<Props> = ({ food, onSelect }) => (
    isSome(onSelect) ? getButton(food, onSelect) : getLink(food)
);

RbaSearchInputOption.displayName = "RbaSearchInputOption";

export default RbaSearchInputOption;
