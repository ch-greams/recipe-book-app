import React from "react";
import * as constants from "@cypress/constants";

import { TemperatureUnit, TimeUnit } from "@common/units";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme,SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeDirection } from "@store/recipe/types";

import styles from "./rba-direction-line-read.module.scss";



interface Props {
    direction: RecipeDirection;
    onClick: () => void;
    onClickMark: () => void;
    updateDirectionTemperatureUnit: RbaSelectChangeCallback;
    updateDirectionTimeUnit: RbaSelectChangeCallback;
}

const RbaDirectionLineRead: React.FC<Props> = ({
    direction,
    onClick,
    onClickMark,
    updateDirectionTemperatureUnit,
    updateDirectionTimeUnit,
}) => {

    return (

        <div className={styles.directionLine}>

            <div
                data-cy={constants.CY_DIRECTION_LINE_CHECKBOX}
                className={styles.directionCheckbox}
                onClick={onClickMark}
            >
                {( direction.isMarked && <div className={styles.directionCheckboxMark} /> )}
            </div>

            <div className={styles.directionInfo}>

                <div
                    className={styles.directionInfoTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : undefined )}
                    onClick={onClick}
                >
                    <div className={styles.directionInfoIndex}>
                        {`${direction.stepNumber}.`}
                    </div>

                    <div
                        data-cy={constants.CY_DIRECTION_INFO_LINE_NAME_TEXT}
                        className={styles.directionInfoName}
                    >
                        {direction.name.toUpperCase()}
                    </div>
                </div>

                <div className={styles.directionInfoMeasures}>

                    {( direction.temperatureValue && (
                        <div
                            data-cy={constants.CY_DIRECTION_INFO_LINE_TEMPERATURE_MEASURE}
                            className={styles.directionInfoMeasure}
                        >
                            <div className={styles.directionInfoAmount}>
                                {direction.temperatureValue}
                            </div>
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
                    ))}

                    {( direction.durationValue && (
                        <div
                            data-cy={constants.CY_DIRECTION_INFO_LINE_DURATION_MEASURE}
                            className={styles.directionInfoMeasure}
                        >
                            <div className={styles.directionInfoAmount}>
                                {direction.durationValue}
                            </div>
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
                    ))}

                </div>
            </div>
        </div>
    );
};

RbaDirectionLineRead.displayName = "RbaDirectionLineRead";

export default RbaDirectionLineRead;
