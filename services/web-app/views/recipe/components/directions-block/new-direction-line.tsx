import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "cypress/constants";

import { DEFAULT_TIME_UNIT, TemperatureUnit, TimeUnit } from "@common/units";
import Utils from "@common/utils";
import type { SelectOption } from "@views/shared/select-input";
import SelectInput, { SelectInputType } from "@views/shared/select-input";
import * as actions from "@store/recipe/actions";
import type { RecipeDirection } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./directions-block.module.scss";



interface Props {
    direction: RecipeDirection;
}


const NewDirectionLine: React.FC<Props> = ({ direction }) => {

    const dispatch = useDispatch();

    const tempMeasureInput = (
        <div
            data-cy={constants.CY_NEW_DIRECTION_INFO_LINE_TEMPERATURE_MEASURE}
            className={styles.directionInfoLineMeasure}
        >
            <input
                data-cy={constants.CY_NEW_DIRECTION_INFO_LINE_TEMPERATURE_INPUT}
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={direction.temperatureValueInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    dispatch(actions.updateNewDirectionTemperatureCount(event.target.value));
                }}
            />

            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.values(TemperatureUnit).map((unit) => ({ value: unit }))}
                value={direction.temperatureUnit}
                onChange={(option: SelectOption<TemperatureUnit>) => {
                    dispatch(actions.updateNewDirectionTemperatureUnit(option.value));
                }}
            />
        </div>
    );

    const timeMeasureInput = (
        <div
            data-cy={constants.CY_NEW_DIRECTION_INFO_LINE_DURATION_MEASURE}
            className={styles.directionInfoLineMeasure}
        >

            <input
                data-cy={constants.CY_NEW_DIRECTION_INFO_LINE_DURATION_INPUT}
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={direction.durationValueInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                    dispatch(actions.updateNewDirectionTimeCount(event.target.value));
                }}
            />

            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.values(TimeUnit).map((unit) => ({ value: unit }))}
                value={direction.durationUnit || DEFAULT_TIME_UNIT}
                onChange={(option: SelectOption<TimeUnit>) => {
                    dispatch(actions.updateNewDirectionTimeUnit(option.value));
                }}
            />
        </div>
    );

    return (
        <div
            data-cy={constants.CY_NEW_DIRECTION_LINE}
            className={styles.directionLine}
        >

            <div
                data-cy={constants.CY_NEW_DIRECTION_LINE_CREATE_BUTTON}
                className={styles.directionLineButton}
                onClick={() => dispatch(actions.createDirection(direction))}
            >
                <IconWrapper
                    isFullWidth={true}
                    width={24} height={24} color={Utils.COLOR_DEFAULT}
                    style={{ transform: "rotate(0.125turn)" }}
                >
                    <RemoveIcon />
                </IconWrapper>
            </div>

            <div className={styles.directionInfoLines}>

                <div
                    className={Utils.classNames({ [styles.directionInfoLine]: true, [styles.newDirection]: true })}
                >

                    <div className={styles.directionInfoLineTitle}>

                        <input
                            data-cy={constants.CY_NEW_DIRECTION_INFO_LINE_STEP_INPUT}
                            type={"text"}
                            className={styles.directionInfoLineIndexInput}
                            value={direction.stepNumber}
                            placeholder={"#"}
                            maxLength={2}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                dispatch(actions.updateNewDirectionStepNumber(Number(event.target.value)));
                            }}
                        />

                        <input
                            data-cy={constants.CY_NEW_DIRECTION_INFO_LINE_NAME_INPUT}
                            type={"text"}
                            className={styles.directionInfoLineNameInput}
                            value={direction.name}
                            placeholder={"TITLE"}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                dispatch(actions.updateNewDirectionName(event.target.value));
                            }}
                        />
                    </div>

                    <div className={styles.directionInfoLineMeasures}>

                        {tempMeasureInput}

                        {timeMeasureInput}

                    </div>
                </div>
            </div>
        </div>
    );
};

NewDirectionLine.displayName = "NewDirectionLine";

export default NewDirectionLine;
