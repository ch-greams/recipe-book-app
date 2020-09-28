import React, { Component } from "react";
import {
    CARBOHYDRATES_GROUP,
    LIPIDS_GROUP,
    MINERALS_GROUP,
    OTHER_GROUP,
    PROTEINS_GROUP,
    VITAMINS_GROUP,
    NutrientGroupType,
    NutritionFactType,
} from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";
import Utils from "../../../common/utils";
import NutritionFactsBlock from "../NutritionFactsBlock/NutritionFactsBlock";
import styles from "./PageDetailedNutritionFactsBlock.scss";



interface Props {
    nutritionFactValues: Dictionary<NutritionFactType, number>;
    nutritionFactInputs: Dictionary<NutritionFactType, string>;
}


export default class PageDetailedNutritionFactsBlock extends Component<Props> {

    public render(): JSX.Element {

        const {
            nutritionFactValues,
            nutritionFactInputs,
        } = this.props;

        return (
            <div className={styles.detailedNutritionFacts}>

                <div className={styles.detailedNutritionFactsColumn}>

                    <NutritionFactsBlock
                        title={NutrientGroupType.Carbohydrates}
                        nutritionFacts={Utils.getNutritionFacts(CARBOHYDRATES_GROUP, nutritionFactValues, nutritionFactInputs)}
                    />

                    <NutritionFactsBlock
                        title={NutrientGroupType.Lipids}
                        nutritionFacts={Utils.getNutritionFacts(LIPIDS_GROUP, nutritionFactValues, nutritionFactInputs)}
                    />

                    <NutritionFactsBlock
                        title={NutrientGroupType.Proteins}
                        nutritionFacts={Utils.getNutritionFacts(PROTEINS_GROUP, nutritionFactValues, nutritionFactInputs)}
                    />
                </div>

                <div className={styles.detailedNutritionFactsColumn}>

                    <NutritionFactsBlock
                        title={NutrientGroupType.Vitamins}
                        nutritionFacts={Utils.getNutritionFacts(VITAMINS_GROUP, nutritionFactValues, nutritionFactInputs)}
                    />

                    <NutritionFactsBlock
                        title={NutrientGroupType.Minerals}
                        nutritionFacts={Utils.getNutritionFacts(MINERALS_GROUP, nutritionFactValues, nutritionFactInputs)}
                    />

                    <NutritionFactsBlock
                        title={NutrientGroupType.Other}
                        nutritionFacts={Utils.getNutritionFacts(OTHER_GROUP, nutritionFactValues, nutritionFactInputs)}
                    />
                </div>

            </div>
        );
    }
}
