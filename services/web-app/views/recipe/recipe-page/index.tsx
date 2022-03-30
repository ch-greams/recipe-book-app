import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import Utils from "@common/utils";
import DirectionsBlock from "@views/recipe/components/directions-block";
import IngredientsBlock from "@views/recipe/components/ingredients-block";
import PageDetailedNutritionFactsBlock from "@views/shared/page-detailed-nutrition-facts-block";
import PageTitleBlock from "@views/shared/page-title-block";
import SingleMessagePage from "@views/shared/single-message-page";
import type { AppState } from "@store";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";
import { requestIngredients } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import GeneralInfoBlock from "./general-info-block";

import styles from "./recipe-page.module.scss";



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

interface RecipePageQuery extends ParsedUrlQuery {
    edit: string;
    rid: string;
}

const RecipePageConnected: React.FC = () => {

    const router = useRouter();
    const { rid: recipeId, edit: isEdit } = router.query as RecipePageQuery;

    const dispatch = useDispatch();

    const recipeItem = useSelector<AppState>((state) => state.recipePage) as RecipePageStore;
    const search = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    useEffect(() => {
        if (Utils.isSome(recipeId)) {
            dispatch(actions.fetchRecipeItemRequest(Number(recipeId)));
            dispatch(requestIngredients());
        }
    }, [ dispatch, recipeId ]);

    return (
        recipeItem.isLoaded
            ? (
                recipeItem.errorMessage
                    ? <SingleMessagePage text={recipeItem.errorMessage} />
                    : (
                        <RecipePage
                            isReadOnly={!( isEdit === "true" )}
                            recipeItem={recipeItem}
                            search={search}
                        />
                    )
            )
            : <SingleMessagePage text={"LOADING"} />
    );
};

RecipePageConnected.displayName = "RecipePageConnected";

export default RecipePageConnected;
