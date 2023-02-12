import React from "react";

import { mapDictionary } from "@common/object";
import RbaJournalBlock from "@views/journal/components/rba-journal-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaPageDetailedNutrientsBlock from "@views/shared/rba-page-detailed-nutrients-block";
import type { JournalStore } from "@store/types/journal";
import type { MetaStore } from "@store/types/meta";
import type { SearchStore } from "@store/types/search";
import type { UserStore } from "@store/types/user";

import RbaJournalDateBlock from "../components/rba-journal-date-block";

import styles from "./rba-journal-page.module.scss";


interface Props {
    journal: JournalStore;
    user: UserStore;
    meta: MetaStore;
    search: SearchStore;
    decrementDate: () => void;
    incrementDate: () => void;
}

const RbaJournalPage: React.FC<Props> = ({ journal, user, meta, search, decrementDate, incrementDate }) => {

    const { nutrientDescriptions } = meta;
    const { journalGroups } = user;
    const { currentDate, entries, nutrients } = journal;

    return (
        <div className={styles.journalPage}>

            <div className={styles.journalPageElements}>

                {/* Journal Block */}

                <RbaJournalDateBlock
                    date={currentDate}
                    isJournalSaved={journal.isSaved}
                    decrementDate={decrementDate}
                    incrementDate={incrementDate}
                />

                <RbaJournalBlock
                    currentDate={currentDate}
                    groups={journalGroups}
                    entries={entries}
                    search={search}
                />

                {/* Detailed Nutrition Information  */}

                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutrientsBlock
                    isReadOnly={true}
                    nutrients={nutrients}
                    nutrientInputs={mapDictionary(nutrients, (_key, value) => String(value))}
                    nutrientDescriptions={nutrientDescriptions}
                />

            </div>
        </div>
    );
};

RbaJournalPage.displayName = "RbaJournalPage";

export default RbaJournalPage;
