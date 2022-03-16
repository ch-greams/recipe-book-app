import React from "react";
import { useDispatch } from "react-redux";

import { DEFAULT_TIME_UNIT, TemperatureUnit, TimeUnit } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeDirection } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./DirectionsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    direction: RecipeDirection;
}


const NewDirectionLine: React.FC<Props> = ({ isReadOnly, direction }) => {

    const dispatch = useDispatch();

    const amountText = (
        <div className={styles.directionInfoLineAmount}>
            {""}
        </div>
    );

    const tempAmountInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineAmountInput}
            placeholder={"#"}
            value={direction.temperatureInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                dispatch(actions.updateNewDirectionTemperatureCount(event.target.value));
            }}
        />
    );

    const tempMeasureInput = (
        <div className={styles.directionInfoLineMeasure}>
                
            {( isReadOnly ? amountText : tempAmountInput )}
            
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.values(TemperatureUnit).map((unit) => ({ value: unit }))}
                value={direction.temperature?.unit}
                onChange={(value: TemperatureUnit) => {
                    dispatch(actions.updateNewDirectionTemperatureUnit(value));
                }}
            />
        </div>
    );

    const timeAmountInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineAmountInput}
            placeholder={"#"}
            value={direction.timeInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                dispatch(actions.updateNewDirectionTimeCount(event.target.value));
            }}
        />
    );

    const timeMeasureInput = (
        <div className={styles.directionInfoLineMeasure}>
                
            {( isReadOnly ? amountText : timeAmountInput )}
            
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.values(TimeUnit).map((unit) => ({ value: unit }))}
                value={direction.time?.unit || DEFAULT_TIME_UNIT}
                onChange={(value: TimeUnit) => {
                    dispatch(actions.updateNewDirectionTimeUnit(value));
                }}
            />
        </div>
    );

    return (
        <div className={styles.directionLine}>

            <div
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
                            type={"text"}
                            className={styles.directionInfoLineNameInput}
                            value={direction.name}
                            placeholder={"TITLE"}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                dispatch(actions.updateNewDirectionName(event.target.value));
                            }}
                        />
                    </div>

                    <div className={styles.directionInfoLineMeasure}>

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
