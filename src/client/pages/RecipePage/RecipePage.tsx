import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipeItem } from "../../store/recipe/types";
import { updateName, updateBrand, updateSubtitle } from "../../store/recipe/actions";
import { AppState } from "../../store";
import PageItemTitleBlock from "../../components/PageItemTitleBlock/PageItemTitleBlock";
import styles from "./RecipePage.scss";



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

                    <PageItemTitleBlock
                        name={name}
                        brand={brand}
                        subtitle={subtitle}
                        updateName={updateName}
                        updateBrand={updateBrand}
                        updateSubtitle={updateSubtitle}
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
