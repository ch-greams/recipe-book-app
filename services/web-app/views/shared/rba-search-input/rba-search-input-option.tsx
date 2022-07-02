import React from "react";
import Link from "next/link";

import { isSome } from "@common/types";
import type { ProductShort } from "@common/typings";
import Utils from "@common/utils";

import type { OnSelectFunc } from ".";

import styles from "./rba-search-input.module.scss";


interface Props {
    product: ProductShort;
    onSelect?: Option<OnSelectFunc>;
}


const getLink = (product: ProductShort): JSX.Element => (
    <Link
        key={product.id}
        href={Utils.getProductPath(product.product_type, product.id)}
    >
        <a className={styles.searchOption}>
            <span>
                {product.name}
            </span>
            <span className={styles.searchOptionType}>
                {product.product_type}
            </span>
        </a>
    </Link>
);

const getButton = (product: ProductShort, onSelect: OnSelectFunc): JSX.Element => (
    <button type={"button"} onClick={() => onSelect(product)} className={styles.searchOption}>
        <span>
            {product.name}
        </span>
        <span className={styles.searchOptionType}>
            {product.product_type}
        </span>
    </button>
);

const RbaSearchInputOption: React.FC<Props> = ({ product, onSelect }) => (
    isSome(onSelect) ? getButton(product, onSelect) : getLink(product)
);

RbaSearchInputOption.displayName = "RbaSearchInputOption";

export default RbaSearchInputOption;
