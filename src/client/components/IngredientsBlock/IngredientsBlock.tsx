import React, { Component } from "react";
import { Units, UnitWeight } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import LinkIcon from "../../icons/link-sharp.svg";
import SearchIcon from "../../icons/search-sharp.svg";
import RemoveIcon from "../../icons/close-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import styles from "./IngredientsBlock.scss";
import { Ingredient, IngredientReference } from "../../store/recipe/types";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";
import Utils from "../../../common/utils";
import { AnyAction } from "redux";
import { Route } from "../Router";
import { Link } from "react-router-dom";



interface Props {
    isReadOnly: boolean;
    ingredients: Ingredient[];
    updateIngredients: (value: Ingredient[]) => AnyAction;
}


export default class IngredientsBlock extends Component<Props> {

    public static defaultProps = {
        isReadOnly: false,
    };


    private removeIngredient(id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.filter((ingredient) => ingredient.foodItem.id !== id)
        );
    }

    private removeAltIngredient(parentId: string, id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.reduce<Ingredient[]>((acc, cur) => [
                ...acc,
                cur.foodItem.id === parentId
                    ? {
                        ...cur,
                        alternatives: cur.alternatives.filter((alt) => alt.id !== id)
                    }
                    : cur
            ], [])
        );
    }

    private switchAltIngredientWithParent(parentId: string, id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.reduce<Ingredient[]>((acc, cur) => {

                if (cur.foodItem.id === parentId) {

                    const alt = cur.alternatives.find((alt) => alt.id === id);
                    const newAlt: IngredientReference = {
                        id: cur.foodItem.name,
                        amount: cur.amount,
                        unit: cur.unit,
                    };

                    return [
                        ...acc,
                        {
                            ...cur,
                            alternatives: [
                                ...cur.alternatives.filter((alt) => alt.id !== id),
                                newAlt,
                            ],
                            amount: alt.amount,
                            unit: alt.unit,
                            foodItem: {
                                ...cur.foodItem,
                                id: alt.id,
                                name: alt.id,
                            },
                        },
                    ];
                }
                else {
                    return [ ...acc, cur];
                }

            }, [])
        );
    }

    private toggleIngredientOpen(id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.map((ingredient) => ({
                ...ingredient,
                isOpen: (ingredient.foodItem.id === id) ? !ingredient.isOpen : ingredient.isOpen
            }))
        );
    }

    private getIngredientInfoLineNutritionFacts(nutritionFacts: Dictionary<NutritionFactType, number>): JSX.Element {

        const nutritionFactTypes = [
            NutritionFactType.Carbohydrate,
            NutritionFactType.Fat,
            NutritionFactType.Protein,
            NutritionFactType.Energy,
        ];

        return (
            <div className={styles.ingredientInfoLineNutritionFacts}>

                {nutritionFactTypes.map( (type) => (
                    <div
                        key={`nutritionFact_${type}`}
                        className={styles.ingredientInfoLineNutritionFact}
                    >

                        <div className={styles.ingredientInfoLineNutritionFactAmount}>
                            {nutritionFacts[type]}
                        </div>
                        <div className={styles.ingredientInfoLineNutritionFactType}>
                            {type.toUpperCase()}
                        </div>

                    </div>
                ) )}
            </div>
        );
    }

    private getIngredientInfoLine(ingredient: Ingredient, isNew: boolean = false): JSX.Element {

        const amountText = (
            <div className={styles.ingredientInfoLineAmountText}>
                {ingredient.amount}
            </div>
        );

        const amountInput = (
            <input
                type={"text"}
                className={styles.ingredientInfoLineAmountInput}
                value={(ingredient.amount || "")}
                onChange={console.log}
            />
        );

        return (
            <div
                key={ingredient.foodItem.name}
                className={Utils.classNames({ [styles.ingredientInfoLine]: true, [styles.newIngredient]: isNew })}
            >

                <div
                    className={styles.ingredientInfoLineName}
                    onClick={() => this.toggleIngredientOpen(ingredient.foodItem.id)}
                >
                    {ingredient.foodItem.name.toUpperCase()}
                </div>

                <div className={styles.ingredientInfoLineMeasure}>
                    
                    {( this.props.isReadOnly ? amountText : amountInput )}
                    
                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(Units)}
                        value={ingredient.unit}
                    />
                </div>
            </div>
        );
    }

    private getAltIngredientLine(parentId: string, altIngredient: IngredientReference, isNew: boolean = false): JSX.Element {

        const { isReadOnly } = this.props;

        const removeButton = (
            <div
                className={styles.altIngredientLineButton}
                onClick={() => this.removeAltIngredient(parentId, altIngredient.id)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#fff"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const searchButton = (
            <div
                className={styles.altIngredientLineButton}
                onClick={() => console.log("TODO: Open search modal")}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#fff"}>
                    <SearchIcon />
                </IconWrapper>
            </div>
        );

        const amountText = (
            <div className={styles.ingredientInfoLineAmountText}>
                {altIngredient.amount}
            </div>
        );

        const amountInput = (
            <input
                type={"text"}
                className={styles.ingredientInfoLineAmountInput}
                value={(altIngredient.amount || "")}
                onChange={console.log}
            />
        );

        return (

            <div key={altIngredient.id} className={styles.altIngredientLine}>

                {( isReadOnly ? null : ( isNew ? searchButton : removeButton ) )}

                <div className={Utils.classNames({
                    [styles.altIngredientInfoLine]: true,
                    [styles.newIngredient]: isNew,
                })}>

                    <div
                        className={styles.ingredientInfoLineName}
                        onClick={() => this.switchAltIngredientWithParent(parentId, altIngredient.id)}
                        onMouseEnter={() => console.log(`Entering ${parentId}/${altIngredient.id}`)}
                        onMouseLeave={() => console.log(`Leaving ${parentId}/${altIngredient.id}`)}
                    >
                        {altIngredient.id.toUpperCase()}
                    </div>

                    <div className={styles.ingredientInfoLineMeasure}>
                        
                        {( this.props.isReadOnly ? amountText : amountInput )}
                        
                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.keys(Units)}
                            value={altIngredient.unit}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getIngredientLine(ingredient: Ingredient, isNew: boolean = false): JSX.Element {

        const { isReadOnly } = this.props;

        const newAlt: IngredientReference = {
            id: "ALTERNATIVE",
            amount: 100,
            unit: UnitWeight.g,
        };

        const checkbox = (<div className={styles.lineCheckbox}></div>);

        const removeButton = (
            <div
                className={styles.ingredientLineButton}
                onClick={() => this.removeIngredient(ingredient.foodItem.id)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const searchButton = (
            <div
                className={styles.ingredientLineButton}
                onClick={() => console.log("TODO: Open modal for new ingredient search")}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <SearchIcon />
                </IconWrapper>
            </div>
        );

        const linkButton = (
            <Link
                to={Utils.getItemPath(Route.Food, ingredient.foodItem.id)}
                className={styles.ingredientLineButton}
                style={( isNew ? { opacity: "0.5" } : null )}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <LinkIcon />
                </IconWrapper>
            </Link>
        );

        const showAlternativeIngredients: boolean = ingredient.isOpen && Utils.arrayIsNotEmpty(ingredient.alternatives);
        const showNewAlternativeIngredient: boolean = ingredient.isOpen && !isNew && !isReadOnly;
        const showSeparator: boolean = showAlternativeIngredients || showNewAlternativeIngredient;

        return (

            <div key={`ingredient_${ingredient.foodItem.id}`} className={styles.ingredientLine}>

                {( isReadOnly ? checkbox : ( isNew ? searchButton : removeButton ) )}

                <div className={styles.ingredientInfoLines}>

                    {this.getIngredientInfoLine(ingredient, isNew)}

                    {( ingredient.isOpen && this.getIngredientInfoLineNutritionFacts(ingredient.foodItem.nutritionFacts) )}

                    {( showSeparator && (<div className={styles.separator}></div>) )}

                    {(
                        showAlternativeIngredients &&
                        ingredient.alternatives.map((alt) => this.getAltIngredientLine(ingredient.foodItem.id, alt, false))
                    )}

                    {( showNewAlternativeIngredient && this.getAltIngredientLine(ingredient.foodItem.id, newAlt, true) )}

                </div>

                {linkButton}

            </div>
        );
    }


    public render(): JSX.Element {

        const { ingredients, isReadOnly } = this.props;

        const newIngredient: Ingredient = {

            isOpen: false,

            foodItem: {
                id: "new",
                name: "NEW INGREDIENT",
                nutritionFacts: {},
            },

            amount: 100,
            unit: UnitWeight.g,

            alternatives: [],
        };

        return (
            <div className={styles.ingredientsBlock}>

                {ingredients.map( (ingredient) => this.getIngredientLine(ingredient) )}

                {( isReadOnly ? null : this.getIngredientLine(newIngredient, true) )}

            </div>
        );
    }
}
