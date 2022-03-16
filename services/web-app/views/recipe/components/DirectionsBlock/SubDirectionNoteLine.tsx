import React from "react";
import { useDispatch } from "react-redux";

import type { SubDirection } from "@common/typings";
import Utils from "@common/utils";
import * as actions from "@store/recipe/actions";
import { SubDirectionType } from "@store/recipe/types";
import InfoBlockIcon from "@icons/alert-circle-sharp.svg";
import BulbIcon from "@icons/bulb-sharp.svg";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import WarningIcon from "@icons/warning-sharp.svg";

import styles from "./DirectionsBlock.module.scss";


const getSubDirectionNoteLineIcon = (type: SubDirectionType): JSX.Element => {

    switch (type) {
        case SubDirectionType.Tip:
            return (<BulbIcon />);

        case SubDirectionType.Warning:
            return (<WarningIcon />);

        case SubDirectionType.Note:
        default:
            return (<InfoBlockIcon />);
    }
};

interface Props {
    isReadOnly: boolean;
    step: SubDirection;
    directionIndex: number;
    stepIndex: number;
}


const SubDirectionNoteLine: React.FC<Props> = ({ isReadOnly, step, directionIndex, stepIndex }) => {

    const dispatch = useDispatch();

    const removeButton = (
        <div
            className={styles.subDirectionLineButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, stepIndex))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const noteText = (
        <div className={styles.directionInfoLineDescription}>
            {step.label}
        </div>
    );

    const noteInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineDescriptionInput}
            placeholder={step.type.toUpperCase()}
            value={step.label}
            onChange={(event) => {
                dispatch(actions.updateSubDirectionNote(directionIndex, stepIndex, event.target.value));
            }}
        />
    );

    return (

        <div className={styles.subDirectionLine}>

            {( !isReadOnly && removeButton )}

            <div className={styles.subDirectionNoteInfoLine}>

                <IconWrapper width={22} height={22} color={Utils.COLOR_WHITE}>
                    {getSubDirectionNoteLineIcon(step.type)}
                </IconWrapper>

                {( isReadOnly ? noteText : noteInput )}

            </div>
        </div>
    );
};

SubDirectionNoteLine.displayName = "SubDirectionNoteLine";

export default SubDirectionNoteLine;
