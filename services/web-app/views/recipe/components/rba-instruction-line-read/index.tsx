import React from "react";
import * as constants from "@cypress/constants";

import { classNames } from "@common/style";
import { isSome } from "@common/types";
import { TemperatureUnit, TimeUnit } from "@common/units";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme,SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeInstruction } from "@store/types/recipe";

import styles from "./rba-instruction-line-read.module.scss";



interface Props {
    instruction: RecipeInstruction;
    onClick: () => void;
    onClickMark: () => void;
    updateInstructionTemperatureUnit: RbaSelectChangeCallback;
    updateInstructionTimeUnit: RbaSelectChangeCallback;
}

const RbaInstructionLineRead: React.FC<Props> = ({
    instruction,
    onClick,
    onClickMark,
    updateInstructionTemperatureUnit,
    updateInstructionTimeUnit,
}) => {

    const instructionDescriptionClassName = classNames({
        [styles.instructionInfoTitle]: true,
        [styles.isMarked]: instruction.isMarked,
    });

    return (

        <div className={styles.instructionLine}>

            <div
                data-cy={constants.CY_INSTRUCTION_CHECKBOX}
                className={styles.instructionCheckbox}
                onClick={onClickMark}
            >
                {( instruction.isMarked && <div className={styles.instructionCheckboxMark} /> )}
            </div>

            <div className={styles.instructionInfo}>

                <div className={instructionDescriptionClassName} onClick={onClick}>

                    <div className={styles.instructionInfoIndex}>
                        {`${instruction.stepNumber}.`}
                    </div>

                    <div
                        data-cy={constants.CY_INSTRUCTION_LINE_DESCRIPTION_TEXT}
                        className={styles.instructionInfoName}
                    >
                        {instruction.description}
                    </div>
                </div>

                <div className={styles.instructionInfoMeasures}>

                    {( isSome(instruction.temperatureValue) && (
                        <div
                            data-cy={constants.CY_INSTRUCTION_LINE_TEMPERATURE_MEASURE}
                            className={styles.instructionInfoMeasure}
                        >
                            <div className={styles.instructionInfoAmount}>
                                {instruction.temperatureValueInput}
                            </div>
                            <RbaSelect
                                data-cy={constants.CY_SELECT_INPUT}
                                theme={SelectTheme.Primary}
                                center={true}
                                width={SelectWidthSize.Medium}
                                height={SelectHeightSize.Medium}
                                options={Object.values(TemperatureUnit).map((unit) => ({ value: unit }))}
                                value={instruction.temperatureUnit}
                                onChange={updateInstructionTemperatureUnit}
                            />
                        </div>
                    ))}

                    {( isSome(instruction.durationValue) && (
                        <div
                            data-cy={constants.CY_INSTRUCTION_LINE_DURATION_MEASURE}
                            className={styles.instructionInfoMeasure}
                        >
                            <div className={styles.instructionInfoAmount}>
                                {instruction.durationValueInput}
                            </div>
                            <RbaSelect
                                data-cy={constants.CY_SELECT_INPUT}
                                theme={SelectTheme.Primary}
                                center={true}
                                width={SelectWidthSize.Medium}
                                height={SelectHeightSize.Medium}
                                options={Object.values(TimeUnit).map((unit) => ({ value: unit }))}
                                value={instruction.durationUnit}
                                onChange={updateInstructionTimeUnit}
                            />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

RbaInstructionLineRead.displayName = "RbaInstructionLineRead";

export default RbaInstructionLineRead;
