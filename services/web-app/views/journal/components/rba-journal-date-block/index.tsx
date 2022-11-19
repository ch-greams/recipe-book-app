import React from "react";

import { formatDate } from "@common/date";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";

import styles from "./rba-journal-date-block.module.scss";


interface Props {
    date: string;
    decrementDate: () => void;
    incrementDate: () => void;
}

const RbaJournalDateBlock: React.FC<Props> = ({ date, decrementDate, incrementDate }) => {

    return (
        <div className={styles.journalDateBlock}>

            <span className={styles.journalDateControlLeft}>
                <RbaButton
                    label={"<"}
                    width={ButtonWidthSize.Full}
                    onClick={decrementDate}
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
                    onClick={incrementDate}
                />
            </span>

        </div>
    );
};

RbaJournalDateBlock.displayName = "RbaJournalDateBlock";

export default RbaJournalDateBlock;
