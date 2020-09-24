import React from "react";
import { connect } from "react-redux";
import { NutritionFactType } from "../../../common/nutrients";
import { updateNutritionFact } from "../../store/food/actions";
import { UnitEnergy, UnitWeight } from "../../../common/units";
import styles from "./NutritionFactsBlock.scss";
import Utils from "../../../common/utils";


export interface NutritionFact {

    amount: number;
    inputValue: string;
    type: NutritionFactType;
    unit: UnitWeight | UnitEnergy;
    dailyValue?: number;
    isFraction: boolean;
}


interface NutritionFactsBlockOwnProps {

    title: string;
    nutritionFacts: NutritionFact[];
}

interface NutritionFactsBlockDispatchToProps {
    updateNutritionFact: typeof updateNutritionFact;
}

interface NutritionFactsBlockProps extends NutritionFactsBlockOwnProps, NutritionFactsBlockDispatchToProps { }


class NutritionFactsBlock extends React.Component<NutritionFactsBlockProps> {

    private handleOnChange(nutritionFact: NutritionFact): (event: React.ChangeEvent<HTMLInputElement>) => void {

        return (event: React.ChangeEvent<HTMLInputElement>) => {

            const inputValue = Utils.decimalNormalizer((event.target.value || ""), "0");
        
            this.props.updateNutritionFact(nutritionFact.type, inputValue);    
        };
    }

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
                    value={nutritionFact.inputValue}
                    onChange={this.handleOnChange(nutritionFact)}
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

const mapDispatchToProps: NutritionFactsBlockDispatchToProps = {
    updateNutritionFact,
};

export default connect(null, mapDispatchToProps)(NutritionFactsBlock);
