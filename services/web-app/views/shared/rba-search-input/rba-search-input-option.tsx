import React from "react";
import Link from "next/link";

import { FOOD, RECIPE } from "@common/labels";
import { getProductPath } from "@common/routes";
import { isSome } from "@common/types";
import type { FoodShort } from "@common/typings";

import type { OnSelectFunc } from ".";

import styles from "./rba-search-input.module.scss";


interface Props {
    product: FoodShort;
    onSelect?: Option<OnSelectFunc>;
}


const getLink = (product: FoodShort): JSX.Element => (
    <Link
        key={product.id}
        href={getProductPath(product.is_recipe, product.id)}
    >
        <a className={styles.searchOption}>
            <span>
                {product.name}
            </span>
            <span className={styles.searchOptionType}>
                {product.is_recipe ? RECIPE : FOOD}
            </span>
        </a>
    </Link>
);

const getButton = (product: FoodShort, onSelect: OnSelectFunc): JSX.Element => (
    <button type={"button"} onClick={() => onSelect(product)} className={styles.searchOption}>
        <span>
            {product.name}
        </span>
        <span className={styles.searchOptionType}>
            {product.is_recipe ? RECIPE : FOOD}
        </span>
    </button>
);

const RbaSearchInputOption: React.FC<Props> = ({ product, onSelect }) => (
    isSome(onSelect) ? getButton(product, onSelect) : getLink(product)
);

RbaSearchInputOption.displayName = "RbaSearchInputOption";

export default RbaSearchInputOption;
