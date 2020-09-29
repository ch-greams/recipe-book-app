import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipeItem } from "../../store/recipe/types";
import { updateName, updateBrand, updateSubtitle } from "../../store/recipe/actions";
import { AppState } from "../../store";
import PageTitleBlock from "../../components/PageTitleBlock/PageTitleBlock";
import styles from "./RecipePage.scss";
import PageDetailedNutritionFactsBlock from "../../components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import SelectInput, { SelectInputType } from "../../components/SelectInput/SelectInput";
import { UnitVolume } from "../../../common/units";
import InfoIcon from "../../icons/information-sharp.svg";
import ReplaceIcon from "../../icons/repeat-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";



interface RecipePageStateToProps {
    recipeItem: RecipeItem;
}

interface RecipePageDispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateSubtitle: typeof updateSubtitle;
}

interface RecipePageProps extends RecipePageStateToProps, RecipePageDispatchToProps { }


class RecipePage extends Component<RecipePageProps> {


    private getIngredientLine(name: string, amount: string): JSX.Element {

        return (

            <div className={styles.ingredientLine}>

                <div className={styles.ingredientLineCheckbox}></div>

                <div className={styles.ingredientLineInfo}>

                    <div className={styles.ingredientLineInfoName}>
                        {name.toUpperCase()}
                    </div>

                    <div className={styles.ingredientLineInfoMeasure}>
                        
                        <div className={styles.ingredientLineInfoAmount}>
                            {amount}
                        </div>
                        
                        <SelectInput
                            type={SelectInputType.IngredientUnit}
                            options={Object.keys(UnitVolume)}
                        />
                    </div>
                </div>

                <div className={styles.ingredientLineButton}>
                    <IconWrapper width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <InfoIcon />
                    </IconWrapper>
                </div>

                <div className={styles.ingredientLineButton}>
                    <IconWrapper width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <ReplaceIcon />
                    </IconWrapper>
                </div>

            </div>
        );
    }

    private getIngredientsBlock(): JSX.Element {


        return (
            <div className={styles.ingredientsBlock}>
                {this.getIngredientLine("Milk", "120")}
                {this.getIngredientLine("Flour", "250")}
                {this.getIngredientLine("Eggs", "2")}
            </div>
        );
    }

    public render(): JSX.Element {

        const {
            recipeItem: {
                name,
                brand,
                subtitle,
            },
            updateName,
            updateBrand,
            updateSubtitle,
        } = this.props;

        return (
            <div className={styles.recipePage}>

                <div className={styles.recipePageElements}>

                    <PageTitleBlock
                        name={name}
                        brand={brand}
                        subtitle={subtitle}
                        updateName={updateName}
                        updateBrand={updateBrand}
                        updateSubtitle={updateSubtitle}
                    />

                    <div className={styles.recipePageBlockTitle}>
                        {"INGREDIENTS"}
                    </div>

                    {this.getIngredientsBlock()}

                    <div className={styles.recipePageBlockTitle}>
                        {"DIRECTIONS"}
                    </div>

                    <div className={styles.recipePageBlockTitle}>
                        {"DETAILED NUTRITION INFORMATION"}
                    </div>

                    <PageDetailedNutritionFactsBlock
                        nutritionFactValues={{}}
                        nutritionFactInputs={{}}
                    />

                </div>
                
            </div>
        );
    }
}


const mapStateToProps = (state: AppState): RecipePageStateToProps => ({
    recipeItem: state.recipePage,
});

const mapDispatchToProps: RecipePageDispatchToProps = {
    updateName,
    updateBrand,
    updateSubtitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePage);
