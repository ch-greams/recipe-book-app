import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

import Utils, { RoutePath } from "@common/utils";
import DirectionsBlock from "@views/recipe/components/directions-block";
import IngredientsBlock from "@views/recipe/components/ingredients-block";
import BlockTitle from "@views/shared/block-title";
import PageDetailedNutritionFactsBlock from "@views/shared/page-detailed-nutrition-facts-block";
import PageTitleBlock from "@views/shared/page-title-block";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
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
    isNew: boolean;
}

const RecipePage: React.FC<RecipePageProps> = ({ isReadOnly, recipeItem, search, isNew }) => {

    const dispatch = useDispatch();

    const saveButtonAction = (
        isNew
            ? () => dispatch(actions.createRecipeItemRequest())
            : () => dispatch(actions.updateRecipeItemRequest())
    );

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

                {(isReadOnly || (
                    <RbaButton
                        label={"SAVE"}
                        width={ButtonWidthSize.Full}
                        onClick={saveButtonAction}
                    />
                ))}

                {/* Title Block */}

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

                {/* Main Block */}

                <GeneralInfoBlock
                    recipeItem={recipeItem}
                    nutritionFacts={nutritionFacts}
                    nutritionFactInputs={nutritionFactInputs}
                />

                <BlockTitle text={"INGREDIENTS"} />

                <IngredientsBlock
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    search={search}
                />

                <BlockTitle text={"DIRECTIONS"} />

                <DirectionsBlock
                    isReadOnly={isReadOnly}
                    newDirection={newDirection}
                    directions={directions}
                    ingredients={ingredients}
                />

                <BlockTitle text={"DETAILED NUTRITION INFORMATION"} />

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

    const dispatch = useDispatch();
    const router = useRouter();

    const { rid, edit: isEdit } = router.query as RecipePageQuery;
    const isNewRecipePage = !Utils.isSome(rid);

    const recipeItem = useSelector<AppState>((state) => state.recipePage) as RecipePageStore;
    const search = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    useEffect(() => {
        if (!isNewRecipePage) {
            const recipeId = Number(rid);
            dispatch(actions.fetchRecipeItemRequest(recipeId));
            dispatch(requestIngredients());
        }
        else if (router.asPath.includes(Utils.getNewItemPath(RoutePath.Recipe))) {

            if (recipeItem.isCreated) {
                router.push(Utils.getItemPath(RoutePath.Recipe, recipeItem.id));
            }
            else {
                dispatch(actions.fetchRecipeItemNew());
            }
        }
    }, [ dispatch, rid, recipeItem.id ]);

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
                            isNew={isNewRecipePage}
                        />
                    )
            )
            : <SingleMessagePage text={"LOADING"} />
    );
};

RecipePageConnected.displayName = "RecipePageConnected";

export default RecipePageConnected;
