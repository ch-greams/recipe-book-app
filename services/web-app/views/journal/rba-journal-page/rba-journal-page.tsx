import React from "react";
import * as constants from "@cypress/constants";

import Utils from "@common/utils";
import RbaJournalBlock from "@views/journal/components/rba-journal-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaPageDetailedNutrientsBlock from "@views/shared/rba-page-detailed-nutrients-block";
import type { JournalStore } from "@store/types/journal";
import type { MetaStore } from "@store/types/meta";
import type { SearchStore } from "@store/types/search";

import RbaJournalDateBlock from "../components/rba-journal-date-block";

import styles from "./rba-journal-page.module.scss";


interface Props {
    userId: number;
    journal: JournalStore;
    meta: MetaStore;
    search: SearchStore;
    decrementDate: () => void;
    incrementDate: () => void;
}

const RbaJournalPage: React.FC<Props> = ({ userId, journal, meta, search, decrementDate, incrementDate }) => {

    const { nutrientDescriptions } = meta;
    const { currentDate, entries, groups, nutrients } = journal;

    return (
        <div className={styles.journalPage}>

            <div className={styles.journalPageElements}>

                {/* Journal Block */}

                <RbaJournalDateBlock
                    date={currentDate}
                    isJournalSaved={journal.isSaved}
                    decrementDate={decrementDate}
                    incrementDate={incrementDate}
                    data-cy={constants.CY_JOURNAL_DATE_BLOCK}
                />

                <RbaJournalBlock
                    userId={userId}
                    currentDate={currentDate}
                    groups={groups}
                    entries={entries}
                    search={search}
                    data-cy={constants.CY_JOURNAL_BLOCK}
                />

                {/* Detailed Nutrition Information  */}

                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutrientsBlock
                    isReadOnly={true}
                    nutrients={nutrients}
                    nutrientInputs={Utils.mapDictionary(nutrients, (_key, value) => String(value))}
                    nutrientDescriptions={nutrientDescriptions}
                    data-cy={constants.CY_DETAILED_NUTRIENTS_BLOCK}
                />

            </div>
        </div>
    );
};

RbaJournalPage.displayName = "RbaJournalPage";

export default RbaJournalPage;
