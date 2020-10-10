import React, { Component } from "react";
import InfoIcon from "../../icons/information-sharp.svg";
import InfoBlockIcon from "../../icons/alert-circle-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import { UnitWeight, UnitTemperature, UnitTime } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import styles from "./DirectionsBlock.scss";
import { Direction, DirectionStep } from "../../store/recipe/types";
import { AnyAction } from "redux";



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

    private getDirectionInfoLine(step: number, name: string, amount: string, isDone: boolean = false): JSX.Element {

        return (
            <div key={`${step}_${name}`} className={styles.directionInfoLine}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( isDone ? { opacity: 0.25 } : null )}
                >

                    <div className={styles.directionInfoLineIndex}>
                        {`${step}.`}
                    </div>

                    <div className={styles.directionInfoLineName}>
                        {name.toUpperCase()}
                    </div>

                </div>

                <div className={styles.directionInfoLineMeasure}>

                    <div className={styles.directionInfoLineAmount}>
                        {amount}
                    </div>
                    
                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTemperature)}
                        onChange={console.log}
                    />

                    <div className={styles.directionInfoLineAmount}>
                        {amount}
                    </div>

                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTime)}
                        onChange={console.log}
                    />
                </div>
            </div>
        );
    }

    private getDirectionLine(direction: Direction, index: number): JSX.Element {

        const FIRST_STEP_NUMBER = 1;

        const checkbox = (
            <div
                className={styles.lineCheckbox}
                onClick={() => this.markDirection(index)}
            >
                {( direction.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
            </div>
        );

        return (
            <div key={direction.name} className={styles.directionLine}>

                {checkbox}

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine((index + FIRST_STEP_NUMBER), direction.name, "180", direction.isMarked)}

                    {direction.notes.map((note, index) => this.getSubDirectionNoteLine(note, index))}

                    {direction.subSteps.map((subStep, stepIndex) => this.getSubDirectionLine(subStep, index, stepIndex))}

                </div>

                <div className={styles.directionLineButton}>
                    <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <InfoIcon />
                    </IconWrapper>
                </div>

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
