import React from "react";
import Link from "next/link";

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
        href={Utils.getItemPath(product.product_type, product.id)}
    >
        <a className={styles.searchOption}>

            <span>
                {product.name.toUpperCase()}
            </span>
            <span className={styles.searchOptionType}>
                {product.product_type.toUpperCase()}
            </span>
        </a>
    </Link>
);

const getButton = (product: ProductShort, onSelect: OnSelectFunc): JSX.Element => (
    <button type={"button"} onClick={() => onSelect(product)} className={styles.searchOption}>
        <span>
            {product.name.toUpperCase()}
        </span>
        <span className={styles.searchOptionType}>
            {product.product_type.toUpperCase()}
        </span>
    </button>
);

const RbaSearchInputOption: React.FC<Props> = ({ product, onSelect }) => (
    Utils.isSome(onSelect) ? getButton(product, onSelect) : getLink(product)
);

RbaSearchInputOption.displayName = "RbaSearchInputOption";

export default RbaSearchInputOption;
