import React, { useEffect, useState } from "react";

import { formatDate } from "@common/date";
import { Color } from "@common/style";
import { IconSize } from "@views/icons/icon-params";
import RbaIconCheck from "@views/icons/rba-icon-check";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";

import styles from "./rba-journal-date-block.module.scss";


interface Props {
    date: string;
    isJournalSaved: boolean;
    decrementDate: () => void;
    incrementDate: () => void;
}

const CHECKMARK_TIMEOUT: number = 1500;

const RbaJournalDateBlock: React.FC<Props> = ({ date, isJournalSaved, decrementDate, incrementDate }) => {

    const [ showCheckmark, setShowCheckmark ] = useState(false);

    useEffect(() => {

        setShowCheckmark(isJournalSaved);
        const timer = setTimeout(() => { setShowCheckmark(false); }, CHECKMARK_TIMEOUT);

        return () => { clearTimeout(timer); };
    }, [ isJournalSaved ]);

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
                    onClick={() => alert("TODO: add a small calendar")}
                />
            </span>

            <span className={styles.journalDateControlRight}>
                <RbaButton
                    label={">"}
                    width={ButtonWidthSize.Full}
                    onClick={incrementDate}
                />
            </span>

            <span className={styles.journalStatus}>
                {showCheckmark && <RbaIconCheck size={IconSize.Small} color={Color.White} />}
            </span>

        </div>
    );
};

RbaJournalDateBlock.displayName = "RbaJournalDateBlock";

export default RbaJournalDateBlock;
