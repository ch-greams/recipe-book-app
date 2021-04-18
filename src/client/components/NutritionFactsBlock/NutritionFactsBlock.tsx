import React from "react";
import { connect } from "react-redux";

import { NutritionFactType, nutritionFactTypeLabelMapping } from "@common/nutritionFacts";
import { InputChangeCallback, Option } from "@common/typings";
import { NutritionFactUnit } from "@common/units";
import Utils from "@common/utils";
import { updateNutritionFact } from "@client/store/food/actions";

import styles from "./NutritionFactsBlock.scss";


export interface NutritionFact {

    amount: number;
    inputValue: string;
    type: NutritionFactType;
    unit: NutritionFactUnit;
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

    private dailyValueBlock = (dailyValue: Option<number>): Option<JSX.Element> => {
        return (
            Utils.isSome(dailyValue)
                ? (
                    <>
                        <div className={styles.nutritionFactDailyValue}>
                            {( dailyValue > Utils.MAX_DAILY_VALUE ? `${Utils.MAX_DAILY_VALUE}+` : dailyValue )}
                        </div>
    
                        <div className={styles.nutritionFactPercent}>
                            {"%"}
                        </div>
                    </>
                )
                : null
        );
    };

    private getNutritionFactLine = (nutritionFact: NutritionFact): JSX.Element => {

        const { isReadOnly } = this.props;

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

                { this.dailyValueBlock(nutritionFact.dailyValue) }

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
