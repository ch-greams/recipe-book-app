import React, { Component } from "react";
import InfoBlockIcon from "../../icons/alert-circle-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import { UnitWeight, UnitTemperature, UnitTime, UnitVolume, Units } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import styles from "./DirectionsBlock.scss";
import {
    Direction,
    IngredientDefault,
    SubDirection,
    SubDirectionIngredient,
    SubDirectionType
} from "../../store/recipe/types";
import { AnyAction } from "redux";
import RemoveIcon from "../../icons/close-sharp.svg";
import Utils from "../../../common/utils";
import { InputChangeCallback } from "../../../common/typings";



interface Props {
    isReadOnly: boolean;
    newDirection: Direction;
    directions: Direction[];
    ingredients: IngredientDefault[];
    updateDirections: (value: Direction[]) => AnyAction;
    updateNewDirection: (value: Direction) => AnyAction;
}


export default class DirectionsBlock extends Component<Props> {
    public static readonly displayName = "DirectionsBlock";

    public static defaultProps: Partial<Props> = {
        isReadOnly: false,
        directions: [],
    };

    // NOTE: Handlers

    private removeDirection(index: number): void {

        const { directions, updateDirections } = this.props;

        delete directions[index];

        updateDirections(directions);
    }

    private removeSubDirection(index: number, stepIndex: number): void {

        const { directions, updateDirections } = this.props;

        delete directions[index].steps[stepIndex];

        updateDirections(directions);
    }

    private toggleDirectionOpen(index: number): void {

        const { directions, updateDirections } = this.props;

        directions[index].isOpen = !directions[index].isOpen;

        updateDirections(directions);
    }

    private markDirection(index: number): void {

        const { directions, updateDirections } = this.props;

        directions[index].isMarked = !directions[index].isMarked;
        directions[index].steps.forEach((step) => {
            if (step.type === SubDirectionType.Ingredient) {
                (step as SubDirectionIngredient).isMarked = directions[index].isMarked;
            }
        });

        if (directions[index].isMarked) {
            directions[index].isOpen = false;
        }

        updateDirections(directions);
    }

    private markDirectionStep(index: number, stepIndex: number): void {

        const { directions, updateDirections } = this.props;

        if (directions[index].steps[stepIndex].type === SubDirectionType.Ingredient) {

            const step = directions[index].steps[stepIndex] as SubDirectionIngredient;
            (directions[index].steps[stepIndex] as SubDirectionIngredient).isMarked = !step.isMarked;
        }

        directions[index].isMarked = directions[index].steps.every((step) => (
            (step.type !== SubDirectionType.Ingredient) || (step as SubDirectionIngredient).isMarked
        ));

        updateDirections(directions);
    }

    private handleSubDirectionIngredientAmountEdit(parentIndex: number, id: string): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => {

                    if (index === parentIndex) {

                        return {
                            ...direction,
                            steps: direction.steps.map((step: SubDirectionIngredient) => {

                                const amount = Utils.decimalNormalizer(event.target.value, step.amountInput);

                                if (step.id === id) {
                                    return {
                                        ...step,
                                        amountInput: amount,
                                        amount: Number(amount),
                                    };
                                }
                                else {
                                    return step;
                                }
                            }),
                        };
                    }
                    else {
                        return direction;
                    }
                })
            );
        };
    }

    private handleSubDirectionIngredientUnitEdit(parentIndex: number, id: string): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => {

                    if (index === parentIndex) {

                        return {
                            ...direction,
                            steps: direction.steps.map((step: SubDirectionIngredient) => (
                                (step.id === id)
                                    ? {
                                        ...step,
                                        unit: event.target.value as (UnitWeight | UnitVolume),
                                    }
                                    : step
                            )),
                        };
                    }
                    else {
                        return direction;
                    }
                })
            );
        };
    }

    private addSubDirection(parentIndex: number, value: string): void {

        const type = (
            Object.keys(SubDirectionType).includes(value)
                ? value as SubDirectionType
                : value.split("_")[Utils.ZERO] as SubDirectionType
        );

        const { directions, ingredients, updateDirections } = this.props;

        if (type === SubDirectionType.Ingredient) {

            const LAST_INDEX = 1;
            const id = value.split("_")[LAST_INDEX];

            const ingredient = ingredients.find((ingredient) => ingredient.item.id === id);

            updateDirections(
                directions.reduce<Direction[]>((acc, cur, index) => [
                    ...acc,
                    parentIndex === index
                        ? {
                            ...cur,
                            steps: [
                                ...cur.steps,
                                {
                                    type: type,
                                    label: ingredient.item.name,
                
                                    id: ingredient.item.id,
                                    isMarked: false,
                                    amount: ingredient.amount,
                                    amountInput: ingredient.amountInput,
                                    unit: ingredient.unit,
                                },
                            ]
                        }
                        : cur
                ], [])
            );
        }
        else {

            updateDirections(
                directions.reduce<Direction[]>((acc, cur, index) => [
                    ...acc,
                    parentIndex === index
                        ? {
                            ...cur,
                            steps: [
                                ...cur.steps,
                                { type: type, label: type },
                            ]
                        }
                        : cur
                ], [])
            );
        }

    }

    private handleSubDirectionTypeSelect(directionIndex: number): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => {

                    if (index === directionIndex) {

                        return {
                            ...direction,
                            newStep: event.target.value,
                        };
                    }
                    else {
                        return direction;
                    }
                })
            );
        };
    }

    private handleDirectionNameEdit(parentIndex: number): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.reduce<Direction[]>((acc, cur, index) => [
                    ...acc,
                    (parentIndex === index)
                        ? {
                            ...cur,
                            name: event.target.value,
                        }
                        : cur
                ], [])
            );
        };
    }

    private handleDirectionTemperatureCountEdit(parentIndex: number): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => {

                    if (index === parentIndex) {

                        const amount = Utils.decimalNormalizer(event.target.value, direction.temperatureInput);

                        return {
                            ...direction,
                            temperatureInput: amount,
                            temperature: {
                                unit: direction.temperature?.unit,
                                count: Number(amount),
                            },
                        };
                    }
                    else {
                        return direction;
                    }
                })
            );
        };
    }

    private handleDirectionTemperatureUnitEdit(parentIndex: number): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => (
                    (index === parentIndex)
                        ? {
                            ...direction,
                            temperature: {
                                count: direction.temperature?.count,
                                unit: event.target.value as UnitTemperature,
                            },
                        }
                        : direction
                ))
            );
        };
    }

    private handleDirectionTimeCountEdit(parentIndex: number): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => {

                    if (index === parentIndex) {

                        const amount = Utils.decimalNormalizer(event.target.value, direction.timeInput);

                        return {
                            ...direction,
                            timeInput: amount,
                            time: {
                                unit: direction.time?.unit,
                                count: Number(amount),
                            },
                        };
                    }
                    else {
                        return direction;
                    }
                })
            );
        };
    }

    private handleDirectionTimeUnitEdit(parentIndex: number): InputChangeCallback {

        const { directions, updateDirections } = this.props;

        return (event) => {

            updateDirections(
                directions.map((direction, index) => (
                    (index === parentIndex)
                        ? {
                            ...direction,
                            time: {
                                count: direction.time?.count,
                                unit: event.target.value as UnitTime,
                            },
                        }
                        : direction
                ))
            );
        };
    }

    private handleNewDirectionTemperatureCountEdit(): InputChangeCallback {

        const { newDirection, updateNewDirection } = this.props;

        return (event) => {

            const amount = Utils.decimalNormalizer(event.target.value, newDirection.temperatureInput);

            updateNewDirection({
                ...newDirection,
                temperatureInput: amount,
                temperature: {
                    unit: newDirection.temperature?.unit,
                    count: Number(amount),
                },
            });
        };
    }

    private handleNewDirectionTemperatureUnitEdit(): InputChangeCallback {

        const { newDirection, updateNewDirection } = this.props;

        return (event) => {

            updateNewDirection({
                ...newDirection,
                temperature: {
                    count: newDirection.temperature?.count,
                    unit: event.target.value as UnitTemperature,
                },
            });
        };
    }

    private handleNewDirectionTimeCountEdit(): InputChangeCallback {

        const { newDirection, updateNewDirection } = this.props;

        return (event) => {

            const amount = Utils.decimalNormalizer(event.target.value, newDirection.timeInput);

            updateNewDirection({
                ...newDirection,
                timeInput: amount,
                time: {
                    unit: newDirection.time?.unit,
                    count: Number(amount),
                },
            });
        };
    }

    private handleNewDirectionTimeUnitEdit(): InputChangeCallback {

        const { newDirection, updateNewDirection } = this.props;

        return (event) => {

            updateNewDirection({
                ...newDirection,
                time: {
                    count: newDirection.time?.count,
                    unit: event.target.value as UnitTime,
                },
            });
        };
    }

    private handleNewDirectionNameEdit(): InputChangeCallback {

        const { newDirection, updateNewDirection } = this.props;

        return (event) => {

            updateNewDirection({
                ...newDirection,
                name: event.target.value,
            });
        };
    }



    // NOTE: Component parts

    private getSubDirectionNoteLine(step: SubDirection, directionIndex: number, stepIndex: number): JSX.Element {

        const { isReadOnly } = this.props;

        const removeButton = (
            <div
                className={styles.subDirectionLineButton}
                onClick={() => this.removeSubDirection(directionIndex, stepIndex)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#fff"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        return (

            <div key={`subDirectionNoteLine_${stepIndex}`} className={styles.subDirectionLine}>

                {( isReadOnly ? null : removeButton )}

                <div className={styles.subDirectionNoteInfoLine}>

                    <IconWrapper width={"22px"} height={"22px"} color={"#fff"}>
                        <InfoBlockIcon />
                    </IconWrapper>

                    <div className={styles.directionInfoLineTitle}>

                        <div className={styles.directionInfoLineDescription}>
                            {step.label}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    private getSubDirectionLine(step: SubDirectionIngredient, index: number, stepIndex: number): JSX.Element {

        const { isReadOnly } = this.props;

        const checkbox = (
            <div
                className={styles.lineCheckbox}
                onClick={() => this.markDirectionStep(index, stepIndex)}
            >
                {( step.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
            </div>
        );

        const removeButton = (
            <div
                className={styles.subDirectionLineButton}
                onClick={() => this.removeSubDirection(index, stepIndex)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#fff"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const ingredientAmountText = (
            <div className={styles.directionInfoLineAmount}>
                {step.amount}
            </div>
        );

        const ingredientAmountInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={step.amountInput}
                onChange={this.handleSubDirectionIngredientAmountEdit(index, step.id).bind(this)}
            />
        );

        return (

            <div key={`subDirectionLine_${stepIndex}`} className={styles.subDirectionLine}>

                {( isReadOnly ? checkbox : removeButton )}

                <div className={styles.subDirectionInfoLine}>

                    <div
                        className={styles.directionInfoLineTitle}
                        style={( step.isMarked ? { opacity: 0.25 } : null )}
                    >

                        <div className={styles.directionInfoLineName}>
                            {step.label.toUpperCase()}
                        </div>

                    </div>

                    <div className={styles.directionInfoLineMeasure}>

                        {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}
                        
                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.keys(Units)}
                            value={step.unit}
                            onChange={this.handleSubDirectionIngredientUnitEdit(index, step.id).bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getNewSubDirectionLine(directionIndex: number, direction: Direction, ingredients: IngredientDefault[]): JSX.Element {

        return (

            <div key={`newSubDirectionLine`} className={styles.subDirectionLine}>

                <div
                    className={styles.subDirectionLineButton}
                    onClick={() => this.addSubDirection(directionIndex, direction.newStep)}
                >
                    <IconWrapper
                        isFullWidth={true}
                        width={"24px"} height={"24px"} color={"#fff"}
                        style={{ transform: "rotate(0.125turn)" }}
                    >
                        <RemoveIcon />
                    </IconWrapper>
                </div>

                <div className={styles.subDirectionInfoLine}>

                    <SelectInput
                        type={SelectInputType.SubDirectionType}
                        options={[
                            SubDirectionType.Tip,
                            SubDirectionType.Note,
                            SubDirectionType.Warning,
                            "----",
                            ...ingredients.map((ingredient) => ({
                                label: ingredient.item.name.toUpperCase(),
                                value: `${SubDirectionType.Ingredient}_${ingredient.item.id}`,
                            })),
                        ]}
                        value={direction.newStep}
                        onChange={this.handleSubDirectionTypeSelect(directionIndex).bind(this)}
                    />

                </div>
            </div>
        );
    }

    private getDirectionInfoLine(index: number, direction: Direction): JSX.Element {

        const { isReadOnly } = this.props;

        const FIRST_STEP_NUMBER = 1;
        const step = index + FIRST_STEP_NUMBER;

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
                onChange={this.handleDirectionTemperatureCountEdit(index).bind(this)}
            />
        );

        const tempSelectInput = (
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.keys(UnitTemperature)}
                value={direction.temperature?.unit}
                onChange={this.handleDirectionTemperatureUnitEdit(index).bind(this)}
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
                onChange={this.handleDirectionTimeCountEdit(index).bind(this)}
            />
        );

        const timeSelectInput = (
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.keys(UnitTime)}
                value={direction.time?.unit}
                onChange={this.handleDirectionTimeUnitEdit(index).bind(this)}
            />
        );

        const indexText = (
            <div className={styles.directionInfoLineIndex}>
                {`${step}.`}
            </div>
        );

        const indexInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineIndexInput}
                value={step}
                placeholder={"#"}
                maxLength={2}
                onChange={console.log}
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
                onChange={this.handleDirectionNameEdit(index).bind(this)}
            />
        );

        return (
            <div
                key={`directionInfo_${step}`}
                className={styles.directionInfoLine}
                style={( isReadOnly ? null : { paddingLeft: "12px" } )}
            >

                <div
                    className={styles.directionInfoLineTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : null )}
                    onClick={( isReadOnly ? () => this.toggleDirectionOpen(index) : null )}
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
    }

    private getDirectionLine(direction: Direction, index: number): JSX.Element {

        const { isReadOnly, ingredients } = this.props;

        const checkbox = (
            <div
                className={styles.lineCheckbox}
                onClick={() => this.markDirection(index)}
            >
                {( direction.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
            </div>
        );

        const removeButton = (
            <div
                className={styles.directionLineButton}
                onClick={() => this.removeDirection(index)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        return (
            <div key={`direction_${index}`} className={styles.directionLine}>

                {( isReadOnly ? checkbox : removeButton )}

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine(index, direction)}

                    {(
                        ( direction.isOpen || !isReadOnly ) &&
                        direction.steps.map((step, stepIndex) => (
                            step.type === SubDirectionType.Ingredient
                                ? this.getSubDirectionLine(step as SubDirectionIngredient, index, stepIndex)
                                : this.getSubDirectionNoteLine(step, index, stepIndex)
                        ))
                    )}

                    {( isReadOnly ? null : this.getNewSubDirectionLine(index, direction, ingredients) )}

                </div>
            </div>
        );
    }

    private getNewDirectionLine(direction: Direction): JSX.Element {

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
                onChange={this.handleNewDirectionTemperatureCountEdit().bind(this)}
            />
        );

        const tempMeasureInput = (
            <div className={styles.directionInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : tempAmountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(UnitTemperature)}
                    value={direction.temperature.unit}
                    onChange={this.handleNewDirectionTemperatureUnitEdit().bind(this)}
                />
            </div>
        );

        const timeAmountInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={direction.timeInput}
                onChange={this.handleNewDirectionTimeCountEdit().bind(this)}
            />
        );

        const timeMeasureInput = (
            <div className={styles.directionInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : timeAmountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(UnitTime)}
                    value={direction.temperature.unit}
                    onChange={this.handleNewDirectionTimeUnitEdit().bind(this)}
                />
            </div>
        );

        return (
            <div className={styles.directionLine}>

                <div
                    className={styles.directionLineButton}
                    onClick={console.log}
                >
                    <IconWrapper
                        isFullWidth={true}
                        width={"24px"} height={"24px"} color={"#00bfa5"}
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
                                // value={"9"}
                                placeholder={"#"}
                                maxLength={2}
                                onChange={console.log}
                            />

                            <input
                                type={"text"}
                                className={styles.directionInfoLineNameInput}
                                value={direction.name}
                                placeholder={"TITLE"}
                                onChange={this.handleNewDirectionNameEdit().bind(this)}
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
    }

    public render(): JSX.Element {

        const { isReadOnly, directions, newDirection } = this.props;

        return (
            <div className={styles.directionsBlock}>

                {directions.map( (direction, index) => this.getDirectionLine(direction, index) )}

                {( isReadOnly ? null : this.getNewDirectionLine(newDirection) )}

            </div>
        );
    }
}
