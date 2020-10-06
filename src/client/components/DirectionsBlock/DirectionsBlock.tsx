import React, { Component } from "react";
import InfoIcon from "../../icons/information-sharp.svg";
import InfoBlockIcon from "../../icons/alert-circle-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import { UnitWeight, UnitTemperature, UnitTime } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import styles from "./DirectionsBlock.scss";
import { Direction, DirectionStep } from "../../store/recipe/types";



interface Props {
    isReadOnly: boolean;
    directions: Direction[];
}


export default class DirectionsBlock extends Component<Props> {

    public static defaultProps: Props = {
        isReadOnly: false,
        directions: [],
    };


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

    private getSubDirectionLine(step: DirectionStep, index: number): JSX.Element {
        return (

            <div key={`subDirectionLine_${index}`} className={styles.subDirectionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.subDirectionInfoLine}>

                    <div className={styles.directionInfoLineTitle}>

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
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getDirectionInfoLine(step: number, name: string, amount: string): JSX.Element {

        return (
            <div key={name} className={styles.directionInfoLine}>

                <div className={styles.directionInfoLineTitle}>

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
                    />

                    <div className={styles.directionInfoLineAmount}>
                        {amount}
                    </div>

                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTime)}
                    />
                </div>
            </div>
        );
    }

    private getDirectionLine(direction: Direction, step: number): JSX.Element {

        return (
            <div key={direction.name} className={styles.directionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine(step, direction.name, "180")}

                    {direction.notes.map((note, index) => this.getSubDirectionNoteLine(note, index))}

                    {direction.subSteps.map((subStep, index) => this.getSubDirectionLine(subStep, index))}

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

        const FIRST_STEP_NUMBER = 1;

        return (
            <div className={styles.directionsBlock}>
                {directions.map(
                    (direction, index) => this.getDirectionLine(direction, index + FIRST_STEP_NUMBER)
                )}
            </div>
        );
    }
}
