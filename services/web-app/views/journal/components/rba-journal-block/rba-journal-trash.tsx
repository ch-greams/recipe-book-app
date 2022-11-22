import React from "react";
import { useDroppable } from "@dnd-kit/core";

import { classNames, Color } from "@common/style";
import { IconSize } from "@views/icons/icon-params";
import RbaIconTrash from "@views/icons/rba-icon-trash";

import styles from "./rba-journal-block.module.scss";


const RbaJournalTrash: React.FC = () => {

    const { isOver, setNodeRef } = useDroppable({
        id: "trash",
        data: { isTrash: true },
    });

    return (
        <div
            className={classNames({
                [styles.journalTrash]: true,
                [styles.journalEntryOver]: isOver,
            })}
            ref={setNodeRef}
        >
            <RbaIconTrash size={IconSize.Medium} color={Color.White} />
        </div>
    );
};

RbaJournalTrash.displayName = "RbaJournalTrash";

export default RbaJournalTrash;
