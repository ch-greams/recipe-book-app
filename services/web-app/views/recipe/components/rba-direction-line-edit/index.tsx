import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import type { InputChangeCallback } from "@common/typings";
import { TemperatureUnit, TimeUnit } from "@common/units";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme,SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeDirection } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";

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

    return (

        <div className={styles.directionLine}>

            <div
                data-cy={constants.CY_DIRECTION_LINE_REMOVE_BUTTON}
                className={styles.directionLineButton}
                onClick={onButtonClick}
            >
                <RbaIconWrapper
                    isFullWidth={true}
                    width={24} height={24} color={Color.Default}
                    style={( isNewDirection ? { transform: "rotate(0.125turn)" } : {} )}
                >
                    <RemoveIcon />
                </RbaIconWrapper>
            </div>

            <div className={styles.directionInfo}>

                <div
                    className={styles.directionInfoTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : undefined )}
                >
                    <input
                        type={"text"}
                        className={styles.directionInfoIndexInput}
                        value={direction.stepNumber}
                        placeholder={"#"}
                        maxLength={2}
                        onChange={updateDirectionStepNumber}
                    />
                    <input
                        data-cy={constants.CY_DIRECTION_INFO_LINE_NAME_INPUT}
                        type={"text"}
                        className={styles.directionInfoNameInput}
                        value={direction.name.toUpperCase()}
                        placeholder={"TITLE"}
                        onChange={updateDirectionName}
                    />
                </div>

                <div className={styles.directionInfoMeasures}>

                    <div
                        data-cy={constants.CY_DIRECTION_INFO_LINE_TEMPERATURE_MEASURE}
                        className={styles.directionInfoMeasure}
                    >

                        <input
                            type={"text"}
                            className={styles.directionInfoAmountInput}
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
                        data-cy={constants.CY_DIRECTION_INFO_LINE_DURATION_MEASURE}
                        className={styles.directionInfoMeasure}
                    >

                        <input
                            type={"text"}
                            className={styles.directionInfoAmountInput}
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
