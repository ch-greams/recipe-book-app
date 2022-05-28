import React from "react";
import * as constants from "@cypress/constants";

import styles from "./rba-page-title-block.module.scss";


interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
}


const RbaPageTitleBlock: React.FC<Props> = ({ name, brand, subtitle, description }) => {

    const descriptionBlock = (
        <div className={styles.descriptionBlock}>
            <div
                data-cy={constants.CY_PAGE_TITLE_DESCRIPTION_TEXT}
                className={styles.description}
            >
                {description}
            </div>
        </div>
    );

    return (

        <div data-cy={constants.CY_PAGE_TITLE_BLOCK} className={styles.titleBlock}>

            <div className={styles.nameBlock}>

                <div
                    data-cy={constants.CY_PAGE_TITLE_NAME_TEXT}
                    className={styles.name}
                >
                    {name.toUpperCase()}
                </div>

                <div
                    data-cy={constants.CY_PAGE_TITLE_BRAND_TEXT}
                    className={styles.brand}
                >
                    {brand.toUpperCase()}
                </div>

            </div>

            <div className={styles.subtitleBlock}>

                <div
                    data-cy={constants.CY_PAGE_TITLE_SUBTITLE_TEXT}
                    className={styles.subtitle}
                >
                    {subtitle.toUpperCase()}
                </div>
            </div>

            {description && descriptionBlock}

        </div>
    );
};

RbaPageTitleBlock.displayName = "RbaPageTitleBlock";

export default RbaPageTitleBlock;
