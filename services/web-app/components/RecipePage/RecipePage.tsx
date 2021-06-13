import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import Utils from "@common/utils";
import DirectionsBlock from "@client/components/DirectionsBlock/DirectionsBlock";
import IngredientsBlock from "@client/components/IngredientsBlock/IngredientsBlock";
import PageDetailedNutritionFactsBlock from "@client/components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import PageTitleBlock from "@client/components/PageTitleBlock/PageTitleBlock";
import SingleMessagePage from "@client/components/SingleMessagePage/SingleMessagePage";
import { AppState } from "@client/store";
import * as actions from "@client/store/recipe/actions";
import { RecipePageStore } from "@client/store/recipe/types";
import { requestIngredients } from "@client/store/search/actions";
import { SearchPageStore } from "@client/store/search/types";

import GeneralInfoBlock from "./GeneralInfoBlock";

import styles from "./RecipePage.module.scss";



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
            dispatch(actions.fetchRecipeItemRequest(recipeId));
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
