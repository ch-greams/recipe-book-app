import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import * as actions from "@store/recipe/actions";
import type { RecipeSubDirectionComment } from "@store/recipe/types";
import { DirectionPartType } from "@store/recipe/types";
import InfoBlockIcon from "@icons/alert-circle-sharp.svg";
import BulbIcon from "@icons/bulb-sharp.svg";
import RemoveIcon from "@icons/close-sharp.svg";
import WarningIcon from "@icons/warning-sharp.svg";

import styles from "./rba-direction-part-note.module.scss";


const getDirectionPartNoteIcon = (type: DirectionPartType): JSX.Element => {

    switch (type) {
        case DirectionPartType.Tip:
            return (<BulbIcon />);

        case DirectionPartType.Warning:
            return (<WarningIcon />);

        case DirectionPartType.Note:
        default:
            return (<InfoBlockIcon />);
    }
};

interface Props {
    isReadOnly: boolean;
    step: RecipeSubDirectionComment;
    directionIndex: number;
    stepNumber: number;
}


const RbaDirectionPartNote: React.FC<Props> = ({ isReadOnly, step, directionIndex, stepNumber }) => {

    const dispatch = useDispatch();

    const removeButton = (
        <div
            data-cy={constants.CY_DIRECTION_PART_REMOVE_BUTTON}
            className={styles.directionPartButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, stepNumber))}
        >
            <RbaIconWrapper isFullWidth={true} width={24} height={24} color={Color.White}>
                <RemoveIcon />
            </RbaIconWrapper>
        </div>
    );

    const noteText = (
        <div className={styles.directionPartNoteText}>
            {step.commentText}
        </div>
    );

    const noteInput = (
        <input
            type={"text"}
            className={styles.directionPartNoteInput}
            placeholder={step.type.toUpperCase()}
            value={step.commentText}
            onChange={(event) => {
                dispatch(actions.updateSubDirectionNote(directionIndex, stepNumber, event.target.value));
            }}
        />
    );

    return (

        <div
            data-cy={constants.CY_DIRECTION_PART}
            className={styles.directionPart}
        >

            {( !isReadOnly && removeButton )}

            <div className={styles.directionPartNote}>

                <RbaIconWrapper width={22} height={22} color={Color.White}>
                    {getDirectionPartNoteIcon(step.type)}
                </RbaIconWrapper>

                {( isReadOnly ? noteText : noteInput )}

            </div>
        </div>
    );
};

RbaDirectionPartNote.displayName = "RbaDirectionPartNote";

export default RbaDirectionPartNote;
