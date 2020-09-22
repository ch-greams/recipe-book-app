import React from "react";
import { NutritionFactType } from "../../../common/nutrients";
import { UnitEnergy, UnitWeight } from "../../../common/units";
import styles from "./NutritionFactsBlock.scss";


export interface NutritionFact {

    amount: number;
    type: NutritionFactType;
    unit: UnitWeight | UnitEnergy;
    dailyValue?: number;
    isFraction: boolean;
}


export interface NutritionFactsBlockProps {

    title: string;
    nutritionFacts: NutritionFact[];
}


export default class NutritionFactsBlock extends React.Component<NutritionFactsBlockProps> {

    private getNutritionFactLine(nutritionFact: NutritionFact): JSX.Element {

        const isDailyValueNotEmpty = ( typeof nutritionFact.dailyValue === "number" );

        const dailyValueBlock = (
            <span className={styles.nutrientDailyValue}>
                {nutritionFact.dailyValue}
            </span>
        );

        const dailyValuePercentBlock = (
            <span className={styles.nutrientPercent}>
                {"%"}
            </span>
        );

        return (

            <div
                className={nutritionFact.isFraction ? styles.subNutrientLine : styles.nutrientLine}
                key={nutritionFact.type}
            >

                <span className={styles.nutrientName}>
                    {nutritionFact.type}
                </span>

                <input
                    type={"text"}
                    className={styles.nutrientAmount}
                    value={nutritionFact.amount}
                    onChange={console.log}
                />

                <span className={styles.nutrientUnit}>
                    {nutritionFact.unit}
                </span>

                {isDailyValueNotEmpty && dailyValueBlock}

                {isDailyValueNotEmpty && dailyValuePercentBlock}

            </div>
        );
    }

    public render(): JSX.Element {

        const { title, nutritionFacts } = this.props;

        return (

            <div className={styles.nutritionFactsBlock}>

                <div className={styles.nutritionFactsBlockTitle}>
                    {title}
                </div>

                { nutritionFacts.map( this.getNutritionFactLine.bind(this) ) }

            </div>
        );
    }
}


