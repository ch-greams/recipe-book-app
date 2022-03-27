import React from "react";
import { useDispatch } from "react-redux";
import { CY_DIRECTION_INFO_LINE_NAME_INPUT,CY_DIRECTION_INFO_LINE_NAME_TEXT } from "cypress/constants";

import { TemperatureUnit, TimeUnit } from "@common/units";
import type { SelectOption } from "@views/shared/SelectInput";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeDirection } from "@store/recipe/types";

import styles from "./DirectionsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    index: number;
    direction: RecipeDirection;
}

const DirectionInfoLine: React.FC<Props> = ({ isReadOnly, index, direction }) => {

    const dispatch = useDispatch();

    const temperatureAmountText = (
        <div className={styles.directionInfoLineAmount}>
            {direction.temperature?.value}
        </div>
    );

    const temperatureSelectInput = (
        <SelectInput
            type={SelectInputType.IngredientUnit}
            options={Object.values(TemperatureUnit).map((unit) => ({ value: unit }))}
            value={direction.temperature?.unit}
            onChange={(option: SelectOption<TemperatureUnit>) => {
                dispatch(actions.updateDirectionTemperatureUnit(index, option.value));
            }}
        />
    );

    const durationAmountText = (
        <div className={styles.directionInfoLineAmount}>
            {direction.duration?.value}
        </div>
    );

    const durationSelectInput = (
        <SelectInput
            type={SelectInputType.IngredientUnit}
            options={Object.values(TimeUnit).map((unit) => ({ value: unit }))}
            value={direction.duration?.unit}
            onChange={(option: SelectOption<TimeUnit>) => {
                dispatch(actions.updateDirectionTimeUnit(index, option.value));
            }}
        />
    );

    return (
        isReadOnly
        ? (
            <div className={styles.directionInfoLine}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : undefined )}
                    onClick={() => dispatch(actions.toggleDirectionOpen(index))}
                >
                    <div className={styles.directionInfoLineIndex}>
                        {`${direction.stepNumber}.`}
                    </div>

                    <div
                        data-cy={CY_DIRECTION_INFO_LINE_NAME_TEXT}
                        className={styles.directionInfoLineName}
                    >
                        {direction.name.toUpperCase()}
                    </div>
                </div>

                <div className={styles.directionInfoLineMeasure}>

                    {( direction.temperature && temperatureAmountText )}
                    {( direction.temperature && temperatureSelectInput )}
                    {( direction.duration && durationAmountText )}
                    {( direction.duration && durationSelectInput )}

                </div>
            </div>
        )
        : (
            <div className={styles.directionInfoLine} style={{ paddingLeft: "12px" }}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : undefined )}
                >
                    <input
                        type={"text"}
                        className={styles.directionInfoLineIndexInput}
                        value={direction.stepNumber}
                        placeholder={"#"}
                        maxLength={2}
                        onChange={(event) => {
                            dispatch(actions.updateDirectionStepNumber(index, Number(event.target.value)));
                        }}
                    />
                    <input
                        data-cy={CY_DIRECTION_INFO_LINE_NAME_INPUT}
                        type={"text"}
                        className={styles.directionInfoLineNameInput}
                        value={direction.name.toUpperCase()}
                        placeholder={"TITLE"}
                        onChange={(event) => {
                            dispatch(actions.updateDirectionName(index, event.target.value));
                        }}
                    />
                </div>

                <div className={styles.directionInfoLineMeasure}>

                    <input
                        type={"text"}
                        className={styles.directionInfoLineAmountInput}
                        placeholder={"#"}
                        value={direction.temperatureInput}
                        onChange={(event) => {
                            dispatch(actions.updateDirectionTemperatureCount(index, event.target.value));
                        }}
                    />

                    {temperatureSelectInput}

                    <input
                        type={"text"}
                        className={styles.directionInfoLineAmountInput}
                        placeholder={"#"}
                        value={direction.durationInput}
                        onChange={(event) => {
                            dispatch(actions.updateDirectionTimeCount(index, event.target.value));
                        }}
                    />

                    {durationSelectInput}

                </div>
            </div>
        )
    );
};

DirectionInfoLine.displayName = "DirectionInfoLine";

export default DirectionInfoLine;
