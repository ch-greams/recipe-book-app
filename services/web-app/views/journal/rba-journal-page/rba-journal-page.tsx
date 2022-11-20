import React from "react";

import Utils from "@common/utils";
import RbaJournalBlock from "@views/journal/components/rba-journal-block";
import RbaBlockTitle from "@views/shared/rba-block-title";
import RbaPageDetailedNutrientsBlock from "@views/shared/rba-page-detailed-nutrients-block";
import type { JournalStore } from "@store/types/journal";
import type { MetaStore } from "@store/types/meta";

import RbaJournalDateBlock from "../components/rba-journal-date-block";

import styles from "./rba-journal-page.module.scss";


interface Props {
    journal: JournalStore;
    meta: MetaStore;
    decrementDate: () => void;
    incrementDate: () => void;
}

const RbaJournalPage: React.FC<Props> = ({ journal, meta, decrementDate, incrementDate }) => {

    const { nutrientDescriptions } = meta;
    const { currentDate, entries, groups, nutrients } = journal;

    return (
        <div className={styles.journalPage}>

            <div className={styles.journalPageElements}>

                {/* Journal Block */}

                <RbaJournalDateBlock
                    date={currentDate}
                    decrementDate={decrementDate}
                    incrementDate={incrementDate}
                />

                <RbaJournalBlock groups={groups} entries={entries} />

                {/* Detailed Nutrition Information  */}

                <RbaBlockTitle text={"DETAILED NUTRITION INFORMATION"} />

                <RbaPageDetailedNutrientsBlock
                    isReadOnly={true}
                    nutrients={nutrients}
                    nutrientInputs={Utils.mapDictionary(nutrients, (_key, value) => String(value))}
                    nutrientDescriptions={nutrientDescriptions}
                />

            </div>
        </div>
    );
};

RbaJournalPage.displayName = "RbaJournalPage";

export default RbaJournalPage;
