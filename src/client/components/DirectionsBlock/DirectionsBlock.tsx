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
    SubDirectionType,
} from "../../store/recipe/types";
import RemoveIcon from "../../icons/close-sharp.svg";
import Utils from "../../../common/utils";
import { InputChangeCallback, SelectChangeCallback } from "../../../common/typings";
import {
    createSubDirection, createSubDirectionIngredient, removeDirection, removeSubDirection, toggleDirectionMark,
    toggleDirectionOpen, toggleSubDirectionMark, updateDirectionName,
    updateDirectionStepNumber, updateDirectionTemperatureCount, updateDirectionTemperatureUnit,
    updateDirectionTimeCount, updateDirectionTimeUnit, updateNewSubDirectionType,
    updateSubDirectionIngredientAmount, updateSubDirectionIngredientUnit, updateSubDirectionNote,
    updateNewDirectionStepNumber, updateNewDirectionName, updateNewDirectionTemperatureCount,
    updateNewDirectionTemperatureUnit, updateNewDirectionTimeCount, updateNewDirectionTimeUnit, createDirection,
} from "../../store/recipe/actions";



interface Props {
    isReadOnly: boolean;
    newDirection: Direction;
    directions: Direction[];
    ingredients: IngredientDefault[];
    removeDirection: typeof removeDirection;
    removeSubDirection: typeof removeSubDirection;
    toggleDirectionOpen: typeof toggleDirectionOpen;
    toggleDirectionMark: typeof toggleDirectionMark;
    toggleSubDirectionMark: typeof toggleSubDirectionMark;
    updateSubDirectionNote: typeof updateSubDirectionNote;
    updateSubDirectionIngredientAmount: typeof updateSubDirectionIngredientAmount;
    updateSubDirectionIngredientUnit: typeof updateSubDirectionIngredientUnit;
    createSubDirectionIngredient: typeof createSubDirectionIngredient;
    createSubDirection: typeof createSubDirection;
    updateNewSubDirectionType: typeof updateNewSubDirectionType;
    updateDirectionStepNumber: typeof updateDirectionStepNumber;
    updateDirectionName: typeof updateDirectionName;
    updateDirectionTemperatureCount: typeof updateDirectionTemperatureCount;
    updateDirectionTemperatureUnit: typeof updateDirectionTemperatureUnit;
    updateDirectionTimeCount: typeof updateDirectionTimeCount;
    updateDirectionTimeUnit: typeof updateDirectionTimeUnit;
    updateNewDirectionStepNumber: typeof updateNewDirectionStepNumber;
    updateNewDirectionName: typeof updateNewDirectionName;
    updateNewDirectionTemperatureCount: typeof updateNewDirectionTemperatureCount;
    updateNewDirectionTemperatureUnit: typeof updateNewDirectionTemperatureUnit;
    updateNewDirectionTimeCount: typeof updateNewDirectionTimeCount;
    updateNewDirectionTimeUnit: typeof updateNewDirectionTimeUnit;
    createDirection: typeof createDirection;
}


export default class DirectionsBlock extends Component<Props> {
    public static readonly displayName = "DirectionsBlock";

    public static defaultProps: Partial<Props> = {
        isReadOnly: false,
        directions: [],
    };

    // NOTE: Handlers - Directions

    private removeDirection(directionIndex: number): void {

        this.props.removeDirection(directionIndex);
    }

    private toggleDirectionOpen(directionIndex: number): void {

        this.props.toggleDirectionOpen(directionIndex);
    }

    private toggleDirectionMark(directionIndex: number): void {

        this.props.toggleDirectionMark(directionIndex);
    }

    private handleDirectionStepNumberEdit(directionIndex: number): InputChangeCallback {
        return (event) => {
            this.props.updateDirectionStepNumber(directionIndex, Number(event.target.value));
        };
    }

    private handleDirectionNameEdit(directionIndex: number): InputChangeCallback {
        return (event) => {
            this.props.updateDirectionName(directionIndex, event.target.value);
        };
    }

    private handleDirectionTemperatureCountEdit(parentIndex: number): InputChangeCallback {
        return (event) => {
            this.props.updateDirectionTemperatureCount(parentIndex, event.target.value);
        };
    }

    private handleDirectionTemperatureUnitEdit(parentIndex: number): SelectChangeCallback {
        return (event) => {
            this.props.updateDirectionTemperatureUnit(parentIndex, event.target.value as UnitTemperature);
        };
    }

    private handleDirectionTimeCountEdit(parentIndex: number): InputChangeCallback {
        return (event) => {
            this.props.updateDirectionTimeCount(parentIndex, event.target.value);
        };
    }

    private handleDirectionTimeUnitEdit(parentIndex: number): SelectChangeCallback {
        return (event) => {
            this.props.updateDirectionTimeUnit(parentIndex, event.target.value as UnitTime);
        };
    }

    // NOTE: Handlers - SubDirections

    private removeSubDirection(directionIndex: number, subDirectionIndex: number): void {

        this.props.removeSubDirection(directionIndex, subDirectionIndex);
    }

    private toggleSubDirectionMark(directionIndex: number, subDirectionIndex: number): void {

        this.props.toggleSubDirectionMark(directionIndex, subDirectionIndex);
    }

    private handleSubDirectionNoteEdit(directionIndex: number, subDirectionIndex: number): InputChangeCallback {
        return (event) => {
            this.props.updateSubDirectionNote(directionIndex, subDirectionIndex, event.target.value);
        };
    }

    private handleSubDirectionIngredientAmountEdit(directionIndex: number, subDirectionIndex: number): InputChangeCallback {
        return (event) => {
            this.props.updateSubDirectionIngredientAmount(directionIndex, subDirectionIndex, event.target.value);
        };
    }

    private handleSubDirectionIngredientUnitEdit(directionIndex: number, subDirectionIndex: number): SelectChangeCallback {
        return (event) => {
            this.props.updateSubDirectionIngredientUnit(
                directionIndex, subDirectionIndex, event.target.value as (UnitWeight | UnitVolume),
            );
        };
    }

    private createSubDirection(directionIndex: number, value: string): void {

        const type = (
            Object.keys(SubDirectionType).includes(value)
                ? value as SubDirectionType
                : value.split("_")[Utils.ZERO] as SubDirectionType
        );

        if (type === SubDirectionType.Ingredient) {

            const LAST_INDEX = 1;
            const id = value.split("_")[LAST_INDEX];

            this.props.createSubDirectionIngredient(directionIndex, id);
        }
        else {
            this.props.createSubDirection(directionIndex, type);
        }
    }

    private handleSubDirectionTypeSelect(directionIndex: number): SelectChangeCallback {
        return (event) => {
            this.props.updateNewSubDirectionType(directionIndex, event.target.value as SubDirectionType);
        };
    }

    // NOTE: Handlers - New Directions

    private handleNewDirectionTemperatureCountEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.props.updateNewDirectionTemperatureCount(event.target.value);
    }

    private handleNewDirectionTemperatureUnitEdit(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.props.updateNewDirectionTemperatureUnit(event.target.value as UnitTemperature);
    }

    private handleNewDirectionTimeCountEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.props.updateNewDirectionTimeCount(event.target.value);
    }

    private handleNewDirectionTimeUnitEdit(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.props.updateNewDirectionTimeUnit(event.target.value as UnitTime);
    }

    private handleNewDirectionNameEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.props.updateNewDirectionName(event.target.value);
    }

    private handleNewDirectionStepNumberEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.props.updateNewDirectionStepNumber(Number(event.target.value));
    }

    private createDirection(direction: Direction): void {
        this.props.createDirection(direction);
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

        const noteText = (
            <div className={styles.directionInfoLineDescription}>
                {step.label}
            </div>
        );

        const noteInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineDescriptionInput}
                placeholder={step.type.toUpperCase()}
                value={step.label}
                onChange={this.handleSubDirectionNoteEdit(directionIndex, stepIndex).bind(this)}
            />
        );

        return (

            <div key={`subDirectionNoteLine_${stepIndex}`} className={styles.subDirectionLine}>

                {( isReadOnly ? null : removeButton )}

                <div className={styles.subDirectionNoteInfoLine}>

                    <IconWrapper width={"22px"} height={"22px"} color={"#fff"}>
                        <InfoBlockIcon />
                    </IconWrapper>

                    {( isReadOnly ? noteText : noteInput )}

                </div>
            </div>
        );
    }

    private getSubDirectionLine(
        subDirection: SubDirectionIngredient,
        directionIndex: number,
        subDirectionIndex: number,
    ): JSX.Element {

        const { isReadOnly } = this.props;

        const checkbox = (
            <div
                className={styles.lineCheckbox}
                onClick={() => this.toggleSubDirectionMark(directionIndex, subDirectionIndex)}
            >
                {( subDirection.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
            </div>
        );

        const removeButton = (
            <div
                className={styles.subDirectionLineButton}
                onClick={() => this.removeSubDirection(directionIndex, subDirectionIndex)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#fff"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const ingredientAmountText = (
            <div className={styles.directionInfoLineAmount}>
                {subDirection.amount}
            </div>
        );

        const ingredientAmountInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={subDirection.amountInput}
                onChange={this.handleSubDirectionIngredientAmountEdit(directionIndex, subDirectionIndex).bind(this)}
            />
        );

        return (

            <div key={`subDirectionLine_${subDirectionIndex}`} className={styles.subDirectionLine}>

                {( isReadOnly ? checkbox : removeButton )}

                <div className={styles.subDirectionInfoLine}>

                    <div
                        className={styles.directionInfoLineTitle}
                        style={( subDirection.isMarked ? { opacity: 0.25 } : null )}
                    >

                        <div className={styles.directionInfoLineName}>
                            {subDirection.label.toUpperCase()}
                        </div>

                    </div>

                    <div className={styles.directionInfoLineMeasure}>

                        {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}
                        
                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.keys(Units)}
                            value={subDirection.unit}
                            onChange={this.handleSubDirectionIngredientUnitEdit(directionIndex, subDirectionIndex).bind(this)}
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
                    onClick={() => this.createSubDirection(directionIndex, direction.newStep)}
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
                onChange={this.handleDirectionStepNumberEdit(index).bind(this)}
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
                key={`directionInfo_${index}`}
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
                onClick={() => this.toggleDirectionMark(index)}
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
                onChange={this.handleNewDirectionTemperatureCountEdit.bind(this)}
            />
        );

        const tempMeasureInput = (
            <div className={styles.directionInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : tempAmountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(UnitTemperature)}
                    value={direction.temperature.unit}
                    onChange={this.handleNewDirectionTemperatureUnitEdit.bind(this)}
                />
            </div>
        );

        const timeAmountInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={direction.timeInput}
                onChange={this.handleNewDirectionTimeCountEdit.bind(this)}
            />
        );

        const timeMeasureInput = (
            <div className={styles.directionInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : timeAmountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(UnitTime)}
                    value={direction.temperature.unit}
                    onChange={this.handleNewDirectionTimeUnitEdit.bind(this)}
                />
            </div>
        );

        return (
            <div className={styles.directionLine}>

                <div
                    className={styles.directionLineButton}
                    onClick={() => this.createDirection(direction)}
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
                                value={direction.stepNumber}
                                placeholder={"#"}
                                maxLength={2}
                                onChange={this.handleNewDirectionStepNumberEdit.bind(this)}
                            />

                            <input
                                type={"text"}
                                className={styles.directionInfoLineNameInput}
                                value={direction.name}
                                placeholder={"TITLE"}
                                onChange={this.handleNewDirectionNameEdit.bind(this)}
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
