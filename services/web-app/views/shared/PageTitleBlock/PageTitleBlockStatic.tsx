import React from "react";

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
            <div className={styles.descriptionBlockText}>
                {description}
            </div>
        </div>
    );

    return (

        <div className={styles.titleBlock} onClick={editTitle}>

            <div className={styles.nameBlock}>

                <div className={styles.nameText}>
                    {name.toUpperCase()}
                </div>

                <div className={styles.brandText}>
                    {brand.toUpperCase()}
                </div>
                
            </div>

            <div className={styles.subtitleBlock}>

                <div className={styles.subtitleText}>
                    {subtitle.toUpperCase()}
                </div>
            </div>

            {description && descriptionBlock}

        </div>
    );
};

PageTitleBlockStatic.displayName = "PageTitleBlockStatic";

export default PageTitleBlockStatic;
