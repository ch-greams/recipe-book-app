import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import Utils from "@common/utils";
import * as actions from "@store/recipe/actions";
import type { RecipeSubDirectionComment } from "@store/recipe/types";
import { SubDirectionType } from "@store/recipe/types";
import InfoBlockIcon from "@icons/alert-circle-sharp.svg";
import BulbIcon from "@icons/bulb-sharp.svg";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import WarningIcon from "@icons/warning-sharp.svg";

import styles from "./rba-directions-block.module.scss";


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
    step: RecipeSubDirectionComment;
    directionIndex: number;
    stepNumber: number;
}


const RbaSubDirectionNoteLine: React.FC<Props> = ({ isReadOnly, step, directionIndex, stepNumber }) => {

    const dispatch = useDispatch();

    const removeButton = (
        <div
            data-cy={constants.CY_SUB_DIRECTION_LINE_REMOVE_BUTTON}
            className={styles.subDirectionLineButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, stepNumber))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const noteText = (
        <div className={styles.directionInfoLineDescription}>
            {step.commentText}
        </div>
    );

    const noteInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineDescriptionInput}
            placeholder={step.type.toUpperCase()}
            value={step.commentText}
            onChange={(event) => {
                dispatch(actions.updateSubDirectionNote(directionIndex, stepNumber, event.target.value));
            }}
        />
    );

    return (

        <div
            data-cy={constants.CY_SUB_DIRECTION_LINE}
            className={styles.subDirectionLine}
        >

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

RbaSubDirectionNoteLine.displayName = "RbaSubDirectionNoteLine";

export default RbaSubDirectionNoteLine;
