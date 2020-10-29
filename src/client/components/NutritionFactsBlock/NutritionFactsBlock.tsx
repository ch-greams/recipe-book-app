import React from "react";
import { connect } from "react-redux";
import { NutritionFactType, nutritionFactTypeLabelMapping } from "../../../common/nutritionFacts";
import { updateNutritionFact } from "../../store/food/actions";
import { UnitEnergy, UnitWeight } from "../../../common/units";
import styles from "./NutritionFactsBlock.scss";
import Utils from "../../../common/utils";
import { InputChangeCallback } from "../../../common/typings";


export interface NutritionFact {

    amount: number;
    inputValue: string;
    type: NutritionFactType;
    unit: UnitWeight | UnitEnergy;
    dailyValue?: number;
    isFraction: boolean;
}


interface NutritionFactsBlockOwnProps {
    isReadOnly: boolean;
    title: string;
    nutritionFacts: NutritionFact[];
}

interface NutritionFactsBlockDispatchToProps {
    updateNutritionFact: typeof updateNutritionFact;
}

interface NutritionFactsBlockProps extends NutritionFactsBlockOwnProps, NutritionFactsBlockDispatchToProps { }


class NutritionFactsBlock extends React.Component<NutritionFactsBlockProps> {
    public static readonly displayName = "NutritionFactsBlock";

    public static readonly defaultProps = {
        isReadOnly: false,
    };

    private handleOnChange = (nutritionFact: NutritionFact): InputChangeCallback => {
        return (event) => {
            
            const inputValue = Utils.decimalNormalizer((event.target.value || ""), nutritionFact.inputValue);
        
            this.props.updateNutritionFact(nutritionFact.type, inputValue);    
        };
    };

    private getNutritionFactLine = (nutritionFact: NutritionFact): JSX.Element => {

        const { isReadOnly } = this.props;

        const isDailyValueNotEmpty = ( typeof nutritionFact.dailyValue === "number" );

        const dailyValueBlock = (
            <div className={styles.nutritionFactDailyValue}>
                {(
                    nutritionFact.dailyValue > Utils.MAX_DAILY_VALUE
                        ? `${Utils.MAX_DAILY_VALUE}+`
                        : nutritionFact.dailyValue
                )}
            </div>
        );

        const dailyValuePercentBlock = (
            <div className={styles.nutritionFactPercent}>
                {"%"}
            </div>
        );

        const nutritionFactAmountInput = (
            <input
                type={"text"}
                className={styles.nutritionFactAmountInput}
                value={(nutritionFact.inputValue || "")}
                onChange={this.handleOnChange(nutritionFact)}
            />
        );

        const nutritionFactAmountText = (
            <div className={styles.nutritionFactAmountText}>
                {nutritionFact.inputValue}
            </div>
        );

        return (

            <div
                className={nutritionFact.isFraction ? styles.subNutrientLine : styles.nutritionFactLine}
                key={nutritionFact.type}
            >

                <div className={styles.nutritionFactName}>
                    {nutritionFactTypeLabelMapping[nutritionFact.type]}
                </div>

                {( isReadOnly ? nutritionFactAmountText : nutritionFactAmountInput )}

                <div className={styles.nutritionFactUnit}>
                    {nutritionFact.unit}
                </div>

                {( isDailyValueNotEmpty && dailyValueBlock )}

                {( isDailyValueNotEmpty && dailyValuePercentBlock )}

            </div>
        );
    };

    public render(): JSX.Element {

        const { title, nutritionFacts } = this.props;

        return (

            <div className={styles.nutritionFactsBlock}>

                <div className={styles.nutritionFactsBlockTitle}>
                    {title}
                </div>

                { nutritionFacts.map(this.getNutritionFactLine) }

            </div>
        );
    }
}

const mapDispatchToProps: NutritionFactsBlockDispatchToProps = {
    updateNutritionFact,
};

export default connect(null, mapDispatchToProps)(NutritionFactsBlock);
