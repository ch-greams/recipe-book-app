import React from "react";

import { formatDate } from "@common/date";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";

import styles from "./rba-journal-date-block.module.scss";


interface Props {
    date: string;
}

const RbaJournalDateBlock: React.FC<Props> = ({ date }) => {
    return (
        <div className={styles.journalDateBlock}>

            <span className={styles.journalDateControlLeft}>
                <RbaButton
                    label={"<"}
                    width={ButtonWidthSize.Full}
                    onClick={() => console.log(`click ${styles.journalDateControlLeft}`)}
                />
            </span>

            <span className={styles.journalDate}>
                <RbaButton
                    label={formatDate(date)}
                    width={ButtonWidthSize.Full}
                    onClick={() => console.log(`click ${formatDate(date)}`)}
                />
            </span>

            <span className={styles.journalDateControlRight}>
                <RbaButton
                    label={">"}
                    width={ButtonWidthSize.Full}
                    onClick={() => console.log(`click ${styles.journalDateControlRight}`)}
                />
            </span>

        </div>
    );
};

RbaJournalDateBlock.displayName = "RbaJournalDateBlock";

export default RbaJournalDateBlock;
