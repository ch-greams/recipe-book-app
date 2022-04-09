import React from "react";

import styles from "./block-title.module.scss";



interface BlockTitleProps {
    text: string;
}

const BlockTitle: React.FC<BlockTitleProps> = ({ text }) => {
    return (
        <div className={styles.blockTitle}>
            {text}
        </div>
    );
};

BlockTitle.displayName = "BlockTitle";

export default BlockTitle;
