import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import type { InputChangeCallback } from "@common/typings";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import * as actions from "@store/recipe/actions";
import type { RecipeDirectionPartComment } from "@store/recipe/types";
import { DirectionPartType } from "@store/recipe/types";
import { IconSize } from "@icons/icon-params";
import RbaIconNote from "@icons/rba-icon-note";
import RbaIconRemove from "@icons/rba-icon-remove";
import RbaIconTip from "@icons/rba-icon-tip";
import RbaIconWarning from "@icons/rba-icon-warning";

import styles from "./rba-direction-part-comment.module.scss";


const getDirectionPartCommentIcon = (type: DirectionPartType): JSX.Element => {

    switch (type) {
        case DirectionPartType.Tip:
            return (<RbaIconTip size={IconSize.Small} color={Color.White} />);

        case DirectionPartType.Warning:
            return (<RbaIconWarning size={IconSize.Small} color={Color.White} />);

        case DirectionPartType.Note:
        default:
            return (<RbaIconNote size={IconSize.Small} color={Color.White} />);
    }
};

interface Props {
    isReadOnly: boolean;
    directionPart: RecipeDirectionPartComment;
    directionIndex: number;
}


const RbaDirectionPartComment: React.FC<Props> = ({ isReadOnly, directionPart, directionIndex }) => {

    const dispatch = useDispatch();

    const removeDirectionPart = (): void => {
        dispatch(actions.removeDirectionPart(directionIndex, directionPart.stepNumber));
    };
    const updateDirectionPartComment: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartNote(directionIndex, directionPart.stepNumber, event.target.value));
    };
    const updateDirectionPartStepNumber: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartStepNumber(directionIndex, directionPart.stepNumber, Number(event.target.value)));
    };

    const removeButton = (
        <div
            data-cy={constants.CY_DIRECTION_PART_REMOVE_BUTTON}
            className={styles.directionPartButton}
            onClick={removeDirectionPart}
        >
            <RbaIconRemove size={IconSize.Medium} color={Color.White} />
        </div>
    );

    const stepNumberInput = (
        <RbaInput
            data-cy={constants.CY_DIRECTION_LINE_STEP_INPUT}
            disabled={isReadOnly}
            align={InputTextAlign.Center}
            theme={InputTheme.Alternative}
            width={InputWidthSize.Small}
            height={InputHeightSize.Medium}
            placeholder={"#"}
            value={String(directionPart.stepNumber)}
            onChange={updateDirectionPartStepNumber}
        />
    );

    return (

        <div
            data-cy={constants.CY_DIRECTION_PART}
            className={styles.directionPart}
        >

            {( !isReadOnly && removeButton )}

            <div className={styles.directionPartComment}>

                {( !isReadOnly && stepNumberInput )}

                {getDirectionPartCommentIcon(directionPart.type)}

                <RbaInput
                    data-cy={constants.CY_DIRECTION_PART_COMMENT_INPUT}
                    disabled={isReadOnly}
                    align={InputTextAlign.Left}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Medium}
                    placeholder={directionPart.type.toUpperCase()}
                    value={directionPart.commentText}
                    onChange={updateDirectionPartComment}
                />

            </div>
        </div>
    );
};

RbaDirectionPartComment.displayName = "RbaDirectionPartComment";

export default RbaDirectionPartComment;
