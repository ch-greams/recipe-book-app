import React from "react";
import * as constants from "@cypress/constants";

import { classNames, Color } from "@common/style";
import { TemperatureUnit, TimeUnit } from "@common/units";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme,SelectWidthSize } from "@views/shared/rba-select";
import type { RecipeInstruction } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconAdd from "@icons/rba-icon-add";
import RbaIconRemove from "@icons/rba-icon-remove";

import styles from "./rba-instruction-line-edit.module.scss";



interface Props {
    instruction: RecipeInstruction;
    isNew?: boolean;
    onButtonClick: () => void;
    updateInstructionStepNumber: RbaInputChangeCallback;
    updateInstructionDescription: RbaInputChangeCallback;
    updateInstructionTemperatureCount: RbaInputChangeCallback;
    updateInstructionTemperatureUnit: RbaSelectChangeCallback;
    updateInstructionTimeCount: RbaInputChangeCallback;
    updateInstructionTimeUnit: RbaSelectChangeCallback;
}

const RbaInstructionLineEdit: React.FC<Props> = ({
    instruction,
    isNew = false,
    onButtonClick,
    updateInstructionStepNumber,
    updateInstructionDescription,
    updateInstructionTemperatureCount,
    updateInstructionTemperatureUnit,
    updateInstructionTimeCount,
    updateInstructionTimeUnit,
}) => {

    const instructionButtonIcon = (
        isNew
            ? <RbaIconAdd size={IconSize.Medium} color={Color.Default} />
            : <RbaIconRemove size={IconSize.Medium} color={Color.Default} />
    );

    const instructionTitleClassName = classNames({
        [styles.instructionInfoTitle]: true,
        [styles.isMarked]: instruction.isMarked,
    });

    return (

        <div
            data-cy={constants.CY_INSTRUCTION_LINE}
            className={styles.instructionLine}
        >

            <div
                data-cy={constants.CY_INSTRUCTION_BUTTON}
                className={styles.instructionLineButton}
                onClick={onButtonClick}
            >
                {instructionButtonIcon}
            </div>

            <div className={styles.instructionInfo}>

                <div className={instructionTitleClassName}>

                    {(
                        !isNew && (
                            <RbaInput
                                maxLength={2}
                                align={InputTextAlign.Center}
                                theme={InputTheme.Primary}
                                width={InputWidthSize.Small}
                                height={InputHeightSize.Medium}
                                placeholder={"#"}
                                value={String(instruction.stepNumber)}
                                onChange={updateInstructionStepNumber}
                            />
                        )
                    )}

                    <RbaInput
                        data-cy={constants.CY_INSTRUCTION_LINE_DESCRIPTION_INPUT}
                        align={InputTextAlign.Left}
                        theme={InputTheme.Primary}
                        width={InputWidthSize.Full}
                        height={InputHeightSize.Medium}
                        value={instruction.description}
                        placeholder={"TITLE"}
                        onChange={updateInstructionDescription}
                    />
                </div>

                <div className={styles.instructionInfoMeasures}>

                    <div
                        data-cy={constants.CY_INSTRUCTION_LINE_TEMPERATURE_MEASURE}
                        className={styles.instructionInfoMeasure}
                    >

                        <RbaInput
                            data-cy={constants.CY_INSTRUCTION_LINE_TEMPERATURE_INPUT}
                            theme={InputTheme.Primary}
                            width={InputWidthSize.Medium}
                            height={InputHeightSize.Medium}
                            placeholder={"#"}
                            value={instruction.temperatureValueInput}
                            normalizer={InputNormalizer.Decimal}
                            onChange={updateInstructionTemperatureCount}
                        />

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

                    <div
                        data-cy={constants.CY_INSTRUCTION_LINE_DURATION_MEASURE}
                        className={styles.instructionInfoMeasure}
                    >

                        <RbaInput
                            data-cy={constants.CY_INSTRUCTION_LINE_DURATION_INPUT}
                            theme={InputTheme.Primary}
                            width={InputWidthSize.Medium}
                            height={InputHeightSize.Medium}
                            placeholder={"#"}
                            value={instruction.durationValueInput}
                            normalizer={InputNormalizer.Decimal}
                            onChange={updateInstructionTimeCount}
                        />

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

                </div>
            </div>
        </div>
    );
};

RbaInstructionLineEdit.displayName = "RbaInstructionLineEdit";

export default RbaInstructionLineEdit;
