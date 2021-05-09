import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Utils from "@common/utils";
import DirectionsBlock from "@client/components/DirectionsBlock/DirectionsBlock";
import IngredientsBlock from "@client/components/IngredientsBlock/IngredientsBlock";
import Loader from "@client/components/Loader/Loader";
import PageDetailedNutritionFactsBlock from "@client/components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import PageTitleBlock from "@client/components/PageTitleBlock/PageTitleBlock";
import { AppState } from "@client/store";
import * as actions from "@client/store/recipe/actions";
import { RecipePageStore } from "@client/store/recipe/types";
import { requestIngredients } from "@client/store/search/actions";
import { SearchPageStore } from "@client/store/search/types";

import GeneralInfoBlock from "./GeneralInfoBlock";

import styles from "./RecipePage.scss";



interface RecipePageProps {
    isReadOnly: boolean;
    recipeItem: RecipePageStore;
    search: SearchPageStore;
}

const RecipePage: React.FC<RecipePageProps> = ({ isReadOnly, recipeItem, search }) => {

    const {
        name,
        brand,
        subtitle,
        description,
        ingredients,
        newDirection,
        directions,
        references,
        nutritionFacts,
    } = recipeItem;


    const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);

    return (
        <div className={styles.recipePage}>

            <div className={styles.recipePageElements}>

                <PageTitleBlock
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    withDescription={true}
                    updateName={actions.updateName}
                    updateBrand={actions.updateBrand}
                    updateSubtitle={actions.updateSubtitle}
                    updateDescription={actions.updateDescription}
                />

                <GeneralInfoBlock
                    recipeItem={recipeItem}
                    nutritionFacts={nutritionFacts}
                    nutritionFactInputs={nutritionFactInputs}
                />

                <div className={styles.recipePageBlockTitle}>
                    {"INGREDIENTS"}
                </div>

                <IngredientsBlock
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    references={references}
                    search={search}
                />

                <div className={styles.recipePageBlockTitle}>
                    {"DIRECTIONS"}
                </div>

                <DirectionsBlock
                    isReadOnly={isReadOnly}
                    newDirection={newDirection}
                    directions={directions}
                    ingredients={ingredients}
                    references={references}
                />

                <div className={styles.recipePageBlockTitle}>
                    {"DETAILED NUTRITION INFORMATION"}
                </div>

                <PageDetailedNutritionFactsBlock
                    isReadOnly={true}
                    nutritionFacts={nutritionFacts}
                    nutritionFactInputs={nutritionFactInputs}
                />

            </div>
            
        </div>
    );
};

RecipePage.displayName = "RecipePage";


const RecipePageConnected: React.FC<RouteComponentProps<{ recipeId: string }>> = ({ location, match }) => {

    const dispatch = useDispatch();

    const recipeItem = useSelector<AppState>((state) => state.recipePage) as RecipePageStore;
    const search = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    const searchParams = new URLSearchParams(location.search);
    const isEdit = ( searchParams.get("edit") === "true" );

    useEffect(() => {
        dispatch(actions.fetchRecipeItemRequest(match.params.recipeId));
        dispatch(requestIngredients());
    }, [ dispatch ]);

    return (
        recipeItem.isLoaded
            ? (
                <RecipePage
                    isReadOnly={!isEdit}
                    recipeItem={recipeItem}
                    search={search}
                />
            )
            : <Loader />
    );
};

RecipePageConnected.displayName = "RecipePageConnected";

export default RecipePageConnected;
