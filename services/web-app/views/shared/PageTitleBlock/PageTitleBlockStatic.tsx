import React from "react";
import {
    CY_PAGE_TITLE_BLOCK, CY_PAGE_TITLE_BRAND_TEXT, CY_PAGE_TITLE_DESCRIPTION_TEXT,
    CY_PAGE_TITLE_NAME_TEXT, CY_PAGE_TITLE_SUBTITLE_TEXT,
} from "cypress/constants";

import styles from "./PageTitleBlock.module.scss";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
    editTitle: () => void;
}

const PageTitleBlockStatic: React.FC<Props> = ({ name, brand, subtitle, description, editTitle }) => {

    const descriptionBlock = (
        <div className={styles.descriptionBlock}>
            <div
                data-cy={CY_PAGE_TITLE_DESCRIPTION_TEXT}
                className={styles.descriptionBlockText}
            >
                {description}
            </div>
        </div>
    );

    return (

        <div
            data-cy={CY_PAGE_TITLE_BLOCK}
            className={styles.titleBlock}
            onClick={editTitle}
        >

            <div className={styles.nameBlock}>

                <div
                    data-cy={CY_PAGE_TITLE_NAME_TEXT}
                    className={styles.nameText}
                >
                    {name.toUpperCase()}
                </div>

                <div
                    data-cy={CY_PAGE_TITLE_BRAND_TEXT}
                    className={styles.brandText}
                >
                    {brand.toUpperCase()}
                </div>

            </div>

            <div className={styles.subtitleBlock}>

                <div
                    data-cy={CY_PAGE_TITLE_SUBTITLE_TEXT}
                    className={styles.subtitleText}
                >
                    {subtitle.toUpperCase()}
                </div>
            </div>

            {description && descriptionBlock}

        </div>
    );
};

PageTitleBlockStatic.displayName = "PageTitleBlockStatic";

export default PageTitleBlockStatic;
