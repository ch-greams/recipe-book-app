import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipeItem } from "../../store/recipe/types";
import { updateRecipeName } from "../../store/recipe/actions";
import { AppState } from "../../store";



interface RecipePageStateToProps {
    recipeItem: RecipeItem;
}

interface RecipePageDispatchToProps {
    updateRecipeName: typeof updateRecipeName;
}

interface RecipePageProps extends RecipePageStateToProps, RecipePageDispatchToProps { }


export class RecipePage extends Component<RecipePageProps> {
    public render(): JSX.Element {
        return (
            <div>

                {"RecipePage"}

                {/* <div className={styles.description}>
                    {this.props.foodItem.description}
                </div> */}
                
            </div>
        );
    }
}



const mapStateToProps = (state: AppState): RecipePageStateToProps => ({
    recipeItem: state.recipeItem,
});

const mapDispatchToProps: RecipePageDispatchToProps = {
    updateRecipeName,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePage);
