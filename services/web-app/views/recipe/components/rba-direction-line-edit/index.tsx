import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import type { InputChangeCallback } from "@common/typings";
import { TemperatureUnit, TimeUnit } from "@common/units";
import Utils from "@common/utils";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme,SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeDirection } from "@store/recipe/types";
import { IconSize } from "@icons/icon-params";
import RbaIconAdd from "@icons/rba-icon-add";
import RbaIconRemove from "@icons/rba-icon-remove";

import styles from "./rba-direction-line-edit.module.scss";



interface Props {
    direction: RecipeDirection;
    isNewDirection?: boolean;
    onButtonClick: () => void;
    updateDirectionStepNumber: InputChangeCallback;
    updateDirectionName: InputChangeCallback;
    updateDirectionTemperatureCount: InputChangeCallback;
    updateDirectionTemperatureUnit: RbaSelectChangeCallback;
    updateDirectionTimeCount: InputChangeCallback;
    updateDirectionTimeUnit: RbaSelectChangeCallback;
}

const RbaDirectionLineEdit: React.FC<Props> = ({
    direction,
    isNewDirection = false,
    onButtonClick,
    updateDirectionStepNumber,
    updateDirectionName,
    updateDirectionTemperatureCount,
    updateDirectionTemperatureUnit,
    updateDirectionTimeCount,
    updateDirectionTimeUnit,
}) => {

    const directionButtonIcon = (
        isNewDirection
            ? <RbaIconAdd size={IconSize.Medium} color={Color.Default} />
            : <RbaIconRemove size={IconSize.Medium} color={Color.Default} />
    );

    const directionTitleClassName = Utils.classNames({
        [styles.directionInfoTitle]: true,
        [styles.isMarked]: direction.isMarked,
    });

    return (

        <div
            data-cy={constants.CY_DIRECTION_LINE}
            className={styles.directionLine}
        >

            <div
                data-cy={constants.CY_DIRECTION_BUTTON}
                className={styles.directionLineButton}
                onClick={onButtonClick}
            >
                {directionButtonIcon}
            </div>

            <div className={styles.directionInfo}>

                <div className={directionTitleClassName}>
                    <RbaInput
                        data-cy={constants.CY_DIRECTION_LINE_STEP_INPUT}
                        align={InputTextAlign.Center}
                        theme={InputTheme.Primary}
                        width={InputWidthSize.Small}
                        height={InputHeightSize.Medium}
                        placeholder={"#"}
                        value={String(direction.stepNumber)}
                        onChange={updateDirectionStepNumber}
                    />

                    <RbaInput
                        data-cy={constants.CY_DIRECTION_LINE_NAME_INPUT}
                        align={InputTextAlign.Left}
                        theme={InputTheme.Primary}
                        width={InputWidthSize.Full}
                        height={InputHeightSize.Medium}
                        value={direction.name.toUpperCase()}
                        placeholder={"TITLE"}
                        onChange={updateDirectionName}
                    />
                </div>

                <div className={styles.directionInfoMeasures}>

                    <div
                        data-cy={constants.CY_DIRECTION_LINE_TEMPERATURE_MEASURE}
                        className={styles.directionInfoMeasure}
                    >

                        <RbaInput
                            data-cy={constants.CY_DIRECTION_LINE_TEMPERATURE_INPUT}
                            theme={InputTheme.Primary}
                            width={InputWidthSize.Medium}
                            height={InputHeightSize.Medium}
                            placeholder={"#"}
                            value={direction.temperatureValueInput}
                            onChange={updateDirectionTemperatureCount}
                        />

                        <RbaSelect
                            theme={SelectTheme.Primary}
                            center={true}
                            width={SelectWidthSize.Medium}
                            height={SelectHeightSize.Medium}
                            options={Object.values(TemperatureUnit).map((unit) => ({ value: unit }))}
                            value={direction.temperatureUnit}
                            onChange={updateDirectionTemperatureUnit}
                        />

                    </div>

                    <div
                        data-cy={constants.CY_DIRECTION_LINE_DURATION_MEASURE}
                        className={styles.directionInfoMeasure}
                    >

                        <RbaInput
                            data-cy={constants.CY_DIRECTION_LINE_DURATION_INPUT}
                            theme={InputTheme.Primary}
                            width={InputWidthSize.Medium}
                            height={InputHeightSize.Medium}
                            placeholder={"#"}
                            value={direction.durationValueInput}
                            onChange={updateDirectionTimeCount}
                        />

                        <RbaSelect
                            theme={SelectTheme.Primary}
                            center={true}
                            width={SelectWidthSize.Medium}
                            height={SelectHeightSize.Medium}
                            options={Object.values(TimeUnit).map((unit) => ({ value: unit }))}
                            value={direction.durationUnit}
                            onChange={updateDirectionTimeUnit}
                        />

                    </div>

                </div>
            </div>
        </div>
    );
};

RbaDirectionLineEdit.displayName = "RbaDirectionLineEdit";

export default RbaDirectionLineEdit;
