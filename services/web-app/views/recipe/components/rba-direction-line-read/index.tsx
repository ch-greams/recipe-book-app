import React from "react";
import * as constants from "@cypress/constants";

import { isSome } from "@common/types";
import { TemperatureUnit, TimeUnit } from "@common/units";
import Utils from "@common/utils";
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

    const directionTitleClassName = Utils.classNames({
        [styles.directionInfoTitle]: true,
        [styles.isMarked]: direction.isMarked,
    });

    return (

        <div className={styles.directionLine}>

            <div
                data-cy={constants.CY_DIRECTION_CHECKBOX}
                className={styles.directionCheckbox}
                onClick={onClickMark}
            >
                {( direction.isMarked && <div className={styles.directionCheckboxMark} /> )}
            </div>

            <div className={styles.directionInfo}>

                <div className={directionTitleClassName} onClick={onClick}>

                    <div className={styles.directionInfoIndex}>
                        {`${direction.stepNumber}.`}
                    </div>

                    <div
                        data-cy={constants.CY_DIRECTION_LINE_NAME_TEXT}
                        className={styles.directionInfoName}
                    >
                        {direction.name}
                    </div>
                </div>

                <div className={styles.directionInfoMeasures}>

                    {( isSome(direction.temperatureValue) && (
                        <div
                            data-cy={constants.CY_DIRECTION_LINE_TEMPERATURE_MEASURE}
                            className={styles.directionInfoMeasure}
                        >
                            <div className={styles.directionInfoAmount}>
                                {direction.temperatureValueInput}
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

                    {( isSome(direction.durationValue) && (
                        <div
                            data-cy={constants.CY_DIRECTION_LINE_DURATION_MEASURE}
                            className={styles.directionInfoMeasure}
                        >
                            <div className={styles.directionInfoAmount}>
                                {direction.durationValueInput}
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
