import React from "react";

import * as labels from "@common/labels";
import type { NutrientDescription, NutrientName } from "@common/nutrients";
import type { JournalGroup } from "@common/typings";
import RbaBlockTitle from "@views/shared/rba-block-title";
import type { JournalStoreGroup } from "@store/types/journal";
import type { UserStoreNutrient } from "@store/types/user";

import RbaFeaturedNutrientsBlock from "../rba-featured-nutrients-block";
import RbaJournalGroupsBlock from "../rba-journal-groups-block";

import styles from "./rba-settings-block.module.scss";


interface Props {
    journalGroups: JournalStoreGroup[];
    userNutrients: UserStoreNutrient[];
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
    updateJournalGroups: (groups: JournalGroup[]) => void;
}

const RbaSettingsBlock: React.FC<Props> = ({
    journalGroups,
    userNutrients,
    nutrientDescriptions,
    updateJournalGroups,
}) => {
    return (
        <div className={styles.journalBlock}>

            <RbaBlockTitle text={labels.USER_SETTINGS_JOURNAL_GROUPS} />

            <RbaJournalGroupsBlock
                groups={journalGroups}
                updateGroups={updateJournalGroups}
            />

            <RbaBlockTitle text={labels.USER_SETTINGS_FEATURED_NUTRIENTS} />

            <RbaFeaturedNutrientsBlock
                userNutrients={userNutrients}
                nutrientDescriptions={nutrientDescriptions}
            />

        </div>
    );
};


RbaSettingsBlock.displayName = "RbaSettingsBlock";

export default RbaSettingsBlock;
