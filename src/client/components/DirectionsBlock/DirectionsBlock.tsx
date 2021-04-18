import React, { Component } from "react";

import type { Dictionary, IngredientItem, InputChangeCallback, SelectChangeCallback, SubDirection } from "@common/typings";
import { TemperatureUnit, TimeUnit, Units,VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import InfoBlockIcon from "@client/icons/alert-circle-sharp.svg";
import BulbIcon from "@client/icons/bulb-sharp.svg";
import RemoveIcon from "@client/icons/close-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";
import WarningIcon from "@client/icons/warning-sharp.svg";
import {
createDirection,
    createSubDirection, createSubDirectionIngredient, removeDirection, removeSubDirection, toggleDirectionMark,
    toggleDirectionOpen, toggleSubDirectionMark, updateDirectionName,
    updateDirectionStepNumber, updateDirectionTemperatureCount, updateDirectionTemperatureUnit,
    updateDirectionTimeCount, updateDirectionTimeUnit, updateNewDirectionName,     updateNewDirectionStepNumber, updateNewDirectionTemperatureCount,
    updateNewDirectionTemperatureUnit, updateNewDirectionTimeCount, updateNewDirectionTimeUnit, updateNewSubDirectionType,
    updateSubDirectionIngredientAmount, updateSubDirectionIngredientUnit, updateSubDirectionNote,
} from "@client/store/recipe/actions";
import {
    RecipeDirection,
    RecipeIngredientDefault,
    RecipeSubDirectionIngredient,
    SubDirectionType,
} from "@client/store/recipe/types";

import styles from "./DirectionsBlock.scss";



interface Props {
    isReadOnly: boolean;
    newDirection: RecipeDirection;
    directions: RecipeDirection[];
    ingredients: RecipeIngredientDefault[];
    references: Dictionary<string, IngredientItem>;

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

    private removeDirection = (directionIndex: number): void => {

        this.props.removeDirection(directionIndex);
    };

    private toggleDirectionOpen = (directionIndex: number): void => {

        this.props.toggleDirectionOpen(directionIndex);
    };

    private toggleDirectionMark = (directionIndex: number): void => {

        this.props.toggleDirectionMark(directionIndex);
    };

    private handleDirectionStepNumberEdit = (directionIndex: number): InputChangeCallback => {
        return (event) => {
            this.props.updateDirectionStepNumber(directionIndex, Number(event.target.value));
        };
    };

    private handleDirectionNameEdit = (directionIndex: number): InputChangeCallback => {
        return (event) => {
            this.props.updateDirectionName(directionIndex, event.target.value);
        };
    };

    private handleDirectionTemperatureCountEdit = (parentIndex: number): InputChangeCallback => {
        return (event) => {
            this.props.updateDirectionTemperatureCount(parentIndex, event.target.value);
        };
    };

    private handleDirectionTemperatureUnitEdit = (parentIndex: number): SelectChangeCallback => {
        return (event) => {
            this.props.updateDirectionTemperatureUnit(parentIndex, event.target.value as TemperatureUnit);
        };
    };

    private handleDirectionTimeCountEdit = (parentIndex: number): InputChangeCallback => {
        return (event) => {
            this.props.updateDirectionTimeCount(parentIndex, event.target.value);
        };
    };

    private handleDirectionTimeUnitEdit = (parentIndex: number): SelectChangeCallback => {
        return (event) => {
            this.props.updateDirectionTimeUnit(parentIndex, event.target.value as TimeUnit);
        };
    };

    // NOTE: Handlers - SubDirections

    private removeSubDirection = (directionIndex: number, subDirectionIndex: number): void => {

        this.props.removeSubDirection(directionIndex, subDirectionIndex);
    };

    private toggleSubDirectionMark = (directionIndex: number, subDirectionIndex: number): void => {

        this.props.toggleSubDirectionMark(directionIndex, subDirectionIndex);
    };

    private handleSubDirectionNoteEdit = (directionIndex: number, subDirectionIndex: number): InputChangeCallback => {
        return (event) => {
            this.props.updateSubDirectionNote(directionIndex, subDirectionIndex, event.target.value);
        };
    };

    private handleSubDirectionIngredientAmountEdit = (directionIndex: number, subDirectionIndex: number): InputChangeCallback => {
        return (event) => {
            this.props.updateSubDirectionIngredientAmount(directionIndex, subDirectionIndex, event.target.value);
        };
    };

    private handleSubDirectionIngredientUnitEdit = (directionIndex: number, subDirectionIndex: number): SelectChangeCallback => {
        return (event) => {
            this.props.updateSubDirectionIngredientUnit(
                directionIndex, subDirectionIndex, event.target.value as (WeightUnit | VolumeUnit),
            );
        };
    };

    private createSubDirection = (directionIndex: number, value: string): void => {

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
    };

    private handleSubDirectionTypeSelect = (directionIndex: number): SelectChangeCallback => {
        return (event) => {
            this.props.updateNewSubDirectionType(directionIndex, event.target.value as SubDirectionType);
        };
    };

    // NOTE: Handlers - New Directions

    private handleNewDirectionTemperatureCountEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.updateNewDirectionTemperatureCount(event.target.value);
    };

    private handleNewDirectionTemperatureUnitEdit = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.updateNewDirectionTemperatureUnit(event.target.value as TemperatureUnit);
    };

    private handleNewDirectionTimeCountEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.updateNewDirectionTimeCount(event.target.value);
    };

    private handleNewDirectionTimeUnitEdit = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.updateNewDirectionTimeUnit(event.target.value as TimeUnit);
    };

    private handleNewDirectionNameEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.updateNewDirectionName(event.target.value);
    };

    private handleNewDirectionStepNumberEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.updateNewDirectionStepNumber(Number(event.target.value));
    };

    private createDirection = (direction: RecipeDirection): void => {
        this.props.createDirection(direction);
    };


    // NOTE: Component parts

    private getSubDirectionNoteLineIcon = (type: SubDirectionType): JSX.Element => {

        switch (type) {
            case SubDirectionType.Tip:
                return (<BulbIcon />);

            case SubDirectionType.Warning:
                return (<WarningIcon />);

            case SubDirectionType.Note:
            default:
                return (<InfoBlockIcon />);
        }
    };

    private getSubDirectionNoteLine(step: SubDirection, directionIndex: number, stepIndex: number): JSX.Element {

        const { isReadOnly } = this.props;

        const removeButton = (
            <div
                className={styles.subDirectionLineButton}
                onClick={() => this.removeSubDirection(directionIndex, stepIndex)}
            >
                <IconWrapper isFullWidth={true} width={24} height={24} color={"#fff"}>
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
                onChange={this.handleSubDirectionNoteEdit(directionIndex, stepIndex)}
            />
        );

        return (

            <div key={`subDirectionNoteLine_${stepIndex}`} className={styles.subDirectionLine}>

                {( isReadOnly ? null : removeButton )}

                <div className={styles.subDirectionNoteInfoLine}>

                    <IconWrapper width={22} height={22} color={"#fff"}>
                        {this.getSubDirectionNoteLineIcon(step.type)}
                    </IconWrapper>

                    {( isReadOnly ? noteText : noteInput )}

                </div>
            </div>
        );
    }

    private getSubDirectionLine(
        subDirection: RecipeSubDirectionIngredient,
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
                <IconWrapper isFullWidth={true} width={24} height={24} color={"#fff"}>
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
                onChange={this.handleSubDirectionIngredientAmountEdit(directionIndex, subDirectionIndex)}
            />
        );

        return (

            <div key={`subDirectionLine_${subDirectionIndex}`} className={styles.subDirectionLine}>

                {( isReadOnly ? checkbox : removeButton )}

                <div className={styles.subDirectionInfoLine}>

                    <div
                        className={styles.directionInfoLineTitle}
                        style={( subDirection.isMarked ? { opacity: 0.25 } : undefined )}
                    >

                        <div className={styles.directionInfoLineName}>
                            {subDirection.label.toUpperCase()}
                        </div>

                    </div>

                    <div className={styles.directionInfoLineMeasure}>

                        {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}
                        
                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.values(Units)}
                            value={subDirection.unit}
                            onChange={this.handleSubDirectionIngredientUnitEdit(directionIndex, subDirectionIndex)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getNewSubDirectionLine(directionIndex: number, direction: RecipeDirection, ingredients: RecipeIngredientDefault[]): JSX.Element {

        const { references } = this.props;

        return (

            <div key={"newSubDirectionLine"} className={styles.subDirectionLine}>

                <div
                    className={styles.subDirectionLineButton}
                    onClick={() => this.createSubDirection(directionIndex, direction.newStep)}
                >
                    <IconWrapper
                        isFullWidth={true}
                        width={24} height={24} color={"#fff"}
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
                                label: references[ingredient.id].name.toUpperCase(),
                                value: `${SubDirectionType.Ingredient}_${ingredient.id}`,
                            })),
                        ]}
                        value={direction.newStep}
                        onChange={this.handleSubDirectionTypeSelect(directionIndex)}
                    />

                </div>
            </div>
        );
    }

    private getDirectionInfoLine(index: number, direction: RecipeDirection): JSX.Element {

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
                onChange={this.handleDirectionTemperatureCountEdit(index)}
            />
        );

        const tempSelectInput = (
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.keys(TemperatureUnit)}
                value={direction.temperature?.unit}
                onChange={this.handleDirectionTemperatureUnitEdit(index)}
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
                onChange={this.handleDirectionTimeCountEdit(index)}
            />
        );

        const timeSelectInput = (
            <SelectInput
                type={SelectInputType.IngredientUnit}
                options={Object.keys(TimeUnit)}
                value={direction.time?.unit}
                onChange={this.handleDirectionTimeUnitEdit(index)}
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
                onChange={this.handleDirectionStepNumberEdit(index)}
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
                onChange={this.handleDirectionNameEdit(index)}
            />
        );

        return (
            <div
                key={`directionInfo_${index}`}
                className={styles.directionInfoLine}
                style={( isReadOnly ? undefined : { paddingLeft: "12px" } )}
            >

                <div
                    className={styles.directionInfoLineTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : undefined )}
                    onClick={( isReadOnly ? () => this.toggleDirectionOpen(index) : undefined )}
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

    private getDirectionLine(direction: RecipeDirection, index: number): JSX.Element {

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
                <IconWrapper isFullWidth={true} width={24} height={24} color={"#00bfa5"}>
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
                                ? this.getSubDirectionLine(step as RecipeSubDirectionIngredient, index, stepIndex)
                                : this.getSubDirectionNoteLine(step, index, stepIndex)
                        ))
                    )}

                    {( isReadOnly ? null : this.getNewSubDirectionLine(index, direction, ingredients) )}

                </div>
            </div>
        );
    }

    private getNewDirectionLine(direction: RecipeDirection): JSX.Element {

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
                onChange={this.handleNewDirectionTemperatureCountEdit}
            />
        );

        const tempMeasureInput = (
            <div className={styles.directionInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : tempAmountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(TemperatureUnit)}
                    value={direction.temperature?.unit}
                    onChange={this.handleNewDirectionTemperatureUnitEdit}
                />
            </div>
        );

        const timeAmountInput = (
            <input
                type={"text"}
                className={styles.directionInfoLineAmountInput}
                placeholder={"#"}
                value={direction.timeInput}
                onChange={this.handleNewDirectionTimeCountEdit}
            />
        );

        const timeMeasureInput = (
            <div className={styles.directionInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : timeAmountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(TimeUnit)}
                    value={direction.temperature?.unit}
                    onChange={this.handleNewDirectionTimeUnitEdit}
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
                        width={24} height={24} color={"#00bfa5"}
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
                                onChange={this.handleNewDirectionStepNumberEdit}
                            />

                            <input
                                type={"text"}
                                className={styles.directionInfoLineNameInput}
                                value={direction.name}
                                placeholder={"TITLE"}
                                onChange={this.handleNewDirectionNameEdit}
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
