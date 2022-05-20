import React from "react";
import Link from "next/link";

import type { ProductShort } from "@common/typings";
import Utils from "@common/utils";

import styles from "./rba-search-input.module.scss";


interface Props {
    product: ProductShort;
}


const RbaSearchInputOption: React.FC<Props> = ({ product }) => (
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

RbaSearchInputOption.displayName = "RbaSearchInputOption";

export default RbaSearchInputOption;
