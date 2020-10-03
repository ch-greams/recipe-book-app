import React, { Component } from "react";
import InfoIcon from "../../icons/information-sharp.svg";
import InfoBlockIcon from "../../icons/alert-circle-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import { UnitWeight, UnitTemperature, UnitTime } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import styles from "./DirectionsBlock.scss";



interface Props {
    isReadOnly: boolean;
}


export default class DirectionsBlock extends Component<Props> {

    public static defaultProps = {
        isReadOnly: false,
    };


    private getSubDirectionNoteLine(description: string): JSX.Element {
        return (

            <div key={name} className={styles.subDirectionLine}>

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

    private getSubDirectionLine(name: string, amount: string): JSX.Element {
        return (

            <div key={name} className={styles.subDirectionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.subDirectionInfoLine}>

                    <div className={styles.directionInfoLineTitle}>

                        <div className={styles.directionInfoLineName}>
                            {name.toUpperCase()}
                        </div>

                    </div>

                    <div className={styles.directionInfoLineMeasure}>

                        <div className={styles.directionInfoLineAmount}>
                            {amount}
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

    private getDirectionLine(
        step: number, name: string, notes: { description: string; }[] = [], subSteps: { name: string; amount: string; }[] = []
    ): JSX.Element {

        return (
            <div key={name} className={styles.directionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine(step, name, "180")}

                    {notes.map((note) => this.getSubDirectionNoteLine(note.description))}

                    {subSteps.map((subStep) => this.getSubDirectionLine(subStep.name, subStep.amount))}

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

        const FIRST_STEP_NUMBER = 1;

        const directions = [
            { name: "Preheat Oven" },
            {
                name: "Stir",
                notes: [
                    { description: "Mix quickly and lightly with a fork until moistened, but do not beat." },
                ],
                subSteps: [
                    { name: "Milk", amount: "100" },
                    { name: "Flour", amount: "240" },
                    { name: "Egg", amount: "120" },                
                ]
            },
            {
                name: "Bake",
                notes: [
                    { description: "If you don't burn your house down, then everything will be ok." },
                ],
            },
        ];

        return (
            <div className={styles.directionsBlock}>
                {directions.map((direction, index) => this.getDirectionLine(
                    index + FIRST_STEP_NUMBER,
                    direction.name,
                    direction.notes,
                    direction.subSteps,
                ))}
            </div>
        );
    }
}
