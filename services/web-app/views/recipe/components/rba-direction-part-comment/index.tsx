import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/style";
import type { InputChangeCallback } from "@common/typings";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeDirectionPartComment } from "@store/types/recipe";
import { DirectionPartType } from "@store/types/recipe";
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

    const dispatch = useAppDispatch();

    const removeDirectionPart = (): void => {
        dispatch(actions.removeDirectionPart({ directionIndex, directionPartId: directionPart.id }));
    };
    const updateDirectionPartComment: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartNote({ directionIndex, directionPartId: directionPart.id, note: event.target.value }));
    };
    const updateDirectionPartStepNumber: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartStepNumber({ directionIndex, directionPartId: directionPart.id, stepNumber: Number(event.target.value) }));
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
            maxLength={2}
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
                    placeholder={directionPart.type}
                    value={directionPart.commentText}
                    onChange={updateDirectionPartComment}
                />

            </div>
        </div>
    );
};

RbaDirectionPartComment.displayName = "RbaDirectionPartComment";

export default RbaDirectionPartComment;
