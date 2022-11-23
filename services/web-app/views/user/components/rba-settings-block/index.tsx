import React from "react";

import RbaBlockTitle from "@views/shared/rba-block-title";

import styles from "./rba-settings-block.module.scss";


const RbaSettingsBlock: React.FC = () => {
    return (
        <div className={styles.journalBlock}>

            <RbaBlockTitle text={"Journal Groups"} />

            <RbaBlockTitle text={"Featured Nutrients"} />

            <RbaBlockTitle text={"Nutrients"} />

        </div>
    );
};


RbaSettingsBlock.displayName = "RbaSettingsBlock";

export default RbaSettingsBlock;
