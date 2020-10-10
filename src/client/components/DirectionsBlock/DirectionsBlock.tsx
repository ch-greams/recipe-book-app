import React, { Component } from "react";
// import InfoIcon from "../../icons/information-sharp.svg";
import InfoBlockIcon from "../../icons/alert-circle-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import { UnitWeight, UnitTemperature, UnitTime } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import styles from "./DirectionsBlock.scss";
import { Direction, DirectionStep } from "../../store/recipe/types";
import { AnyAction } from "redux";
import RemoveIcon from "../../icons/close-sharp.svg";



interface Props {
    isReadOnly: boolean;
    directions: Direction[];
    updateDirections: (value: Direction[]) => AnyAction;
}


export default class DirectionsBlock extends Component<Props> {

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

    private toggleDirectionOpen(index: number): void {

        const { directions, updateDirections } = this.props;

        directions[index].isOpen = !directions[index].isOpen;

        updateDirections(directions);
    }


    private markDirection(index: number): void {

        const { directions, updateDirections } = this.props;

        directions[index].isMarked = !directions[index].isMarked;
        directions[index].subSteps.forEach((step) => step.isMarked = directions[index].isMarked);

        updateDirections(directions);
    }

    private markDirectionStep(index: number, stepIndex: number): void {

        const { directions, updateDirections } = this.props;

        directions[index].subSteps[stepIndex].isMarked = !directions[index].subSteps[stepIndex].isMarked;
        directions[index].isMarked = directions[index].subSteps.every((step) => step.isMarked);

        updateDirections(directions);
    }

    // NOTE: Component parts

    private getSubDirectionNoteLine(description: string, index: number): JSX.Element {
        return (

            <div key={`subDirectionNoteLine_${index}`} className={styles.subDirectionLine}>

                <div className={styles.subDirectionNoteInfoLine}>

                    <IconWrapper width={"22px"} height={"22px"} color={"#fff"}>
                        <InfoBlockIcon />
                    </IconWrapper>

                    <div className={styles.directionInfoLineTitle}>

                        <div className={styles.directionInfoLineDescription}>
                            {description}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    private getSubDirectionLine(step: DirectionStep, index: number, stepIndex: number): JSX.Element {

        const checkbox = (
            <div
                className={styles.lineCheckbox}
                onClick={() => this.markDirectionStep(index, stepIndex)}
            >
                {( step.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
            </div>
        );

        return (

            <div key={`subDirectionLine_${stepIndex}`} className={styles.subDirectionLine}>

                {checkbox}

                <div className={styles.subDirectionInfoLine}>

                    <div
                        className={styles.directionInfoLineTitle}
                        style={( step.isMarked ? { opacity: 0.25 } : null )}
                    >

                        <div className={styles.directionInfoLineName}>
                            {step.foodId.toUpperCase()}
                        </div>

                    </div>

                    <div className={styles.directionInfoLineMeasure}>

                        <div className={styles.directionInfoLineAmount}>
                            {step.amount}
                        </div>
                        
                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.keys(UnitWeight)}
                            onChange={console.log}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getDirectionInfoLine(index: number, direction: Direction): JSX.Element {

        const FIRST_STEP_NUMBER = 1;
        const step = index + FIRST_STEP_NUMBER;

        return (
            <div key={`${step}_${direction.name}`} className={styles.directionInfoLine}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( direction.isMarked ? { opacity: 0.25 } : null )}
                    onClick={() => this.toggleDirectionOpen(index)}
                >
                    <div className={styles.directionInfoLineIndex}>
                        {`${step}.`}
                    </div>

                    <div className={styles.directionInfoLineName}>
                        {direction.name.toUpperCase()}
                    </div>
                </div>

                <div className={styles.directionInfoLineMeasure}>

                    <div className={styles.directionInfoLineAmount}>
                        {direction.temperature.count}
                    </div>
                    
                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTemperature)}
                        value={direction.temperature.unit}
                        onChange={console.log}
                    />

                    <div className={styles.directionInfoLineAmount}>
                        {direction.time.count}
                    </div>

                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTime)}
                        value={direction.time.unit}
                        onChange={console.log}
                    />
                </div>
            </div>
        );
    }

    private getDirectionLine(direction: Direction, index: number): JSX.Element {

        const { isReadOnly } = this.props;

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

        // const infoButton = (
        //     <div className={styles.directionLineButton}>
        //         <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
        //             <InfoIcon />
        //         </IconWrapper>
        //     </div>
        // );

        return (
            <div key={direction.name} className={styles.directionLine}>

                {( isReadOnly ? checkbox : removeButton )}

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine(index, direction)}

                    {direction.isOpen && direction.notes.map((note, index) => this.getSubDirectionNoteLine(note, index))}

                    {direction.isOpen && direction.subSteps.map((subStep, stepIndex) => this.getSubDirectionLine(subStep, index, stepIndex))}

                </div>

                {/* {infoButton} */}

            </div>
        );
    }


    public render(): JSX.Element {

        const { directions } = this.props;

        return (
            <div className={styles.directionsBlock}>
                {directions.map(
                    (direction, index) => this.getDirectionLine(direction, index)
                )}
            </div>
        );
    }
}
