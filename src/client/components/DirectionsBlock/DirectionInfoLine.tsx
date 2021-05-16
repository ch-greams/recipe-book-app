import React from "react";
import { useDispatch } from "react-redux";

import { TemperatureUnit, TimeUnit } from "@common/units";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import * as actions from "@client/store/recipe/actions";
import { RecipeDirection } from "@client/store/recipe/types";

import styles from "./DirectionsBlock.scss";



interface Props {
    isReadOnly: boolean;
    index: number;
    direction: RecipeDirection;
}

const DirectionInfoLine: React.FC<Props> = ({ isReadOnly, index, direction }) => {

    const dispatch = useDispatch();

    const tempAmountText = (
        <div className={styles.directionInfoLineAmount}>
            {direction.temperature?.count}
        </div>
    );

    const tempAmountInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineAmountInput}
            placeholder={"#"}
            value={direction.temperatureInput}
            onChange={(event) => {
                dispatch(actions.updateDirectionTemperatureCount(index, event.target.value));
            }}
        />
    );

    const tempSelectInput = (
        <SelectInput
            type={SelectInputType.IngredientUnit}
            options={Object.keys(TemperatureUnit).map((unit) => ({ value: unit }))}
            value={direction.temperature?.unit}
            onChange={(value: TemperatureUnit) => {
                dispatch(actions.updateDirectionTemperatureUnit(index, value));
            }}
        />
    );

    const timeAmountText = (
        <div className={styles.directionInfoLineAmount}>
            {direction.time?.count}
        </div>
    );

    const timeAmountInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineAmountInput}
            placeholder={"#"}
            value={direction.timeInput}
            onChange={(event) => {
                dispatch(actions.updateDirectionTimeCount(index, event.target.value));
            }}
        />
    );

    const timeSelectInput = (
        <SelectInput
            type={SelectInputType.IngredientUnit}
            options={Object.keys(TimeUnit).map((unit) => ({ value: unit }))}
            value={direction.time?.unit}
            onChange={(value: TimeUnit) => {
                dispatch(actions.updateDirectionTimeUnit(index, value));
            }}
        />
    );

    const indexText = (
        <div className={styles.directionInfoLineIndex}>
            {`${direction.stepNumber}.`}
        </div>
    );

    const indexInput = (
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
    );

    const titleText = (
        <div className={styles.directionInfoLineName}>
            {direction.name.toUpperCase()}
        </div>
    );

    const titleInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineNameInput}
            value={direction.name.toUpperCase()}
            placeholder={"TITLE"}
            onChange={(event) => {
                dispatch(actions.updateDirectionName(index, event.target.value));
            }}
        />
    );

    return (
        <div
            className={styles.directionInfoLine}
            style={( isReadOnly ? undefined : { paddingLeft: "12px" } )}
        >

            <div
                className={styles.directionInfoLineTitle}
                style={( direction.isMarked ? { opacity: 0.25 } : undefined )}
                onClick={( isReadOnly ? () => dispatch(actions.toggleDirectionOpen(index)) : undefined )}
            >
                {( isReadOnly ? indexText : indexInput )}

                {( isReadOnly ? titleText : titleInput )}

            </div>

            <div className={styles.directionInfoLineMeasure}>

                {( isReadOnly ? ( direction.temperature && tempAmountText ) : tempAmountInput )}

                {( isReadOnly ? ( direction.temperature && tempSelectInput ) : tempSelectInput )}

                {( isReadOnly ? ( direction.time && timeAmountText ) : timeAmountInput )}

                {( isReadOnly ? ( direction.time && timeSelectInput ) : timeSelectInput )}

            </div>
        </div>
    );
};

DirectionInfoLine.displayName = "DirectionInfoLine";

export default DirectionInfoLine;
