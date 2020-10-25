import React, { Component } from "react";
import { Units, UnitVolume, UnitWeight } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import LinkIcon from "../../icons/link-sharp.svg";
import SearchIcon from "../../icons/search-sharp.svg";
import RemoveIcon from "../../icons/close-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import styles from "./IngredientsBlock.scss";
import { RecipeIngredientDefault, RecipeIngredient } from "../../store/recipe/types";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary, InputChangeCallback, SelectChangeCallback } from "../../../common/typings";
import Utils from "../../../common/utils";
import { Link } from "react-router-dom";
import { SearchPageStore } from "../../store/search/types";
import { RoutePath } from "../Root";
import {
    addAltIngredient,
    addIngredient,
    removeAltIngredient, removeIngredient, replaceIngredientWithAlternative,
    toggleIngredientMark, toggleIngredientOpen, updateAltIngredientAmount,
    updateAltIngredientUnit, updateAltNutritionFacts, updateIngredientAmount, updateIngredientUnit,
} from "../../store/recipe/actions";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredientDefault[];
    search: SearchPageStore;

    removeIngredient: typeof removeIngredient;
    removeAltIngredient: typeof removeAltIngredient;
    replaceIngredientWithAlternative: typeof replaceIngredientWithAlternative;
    toggleIngredientOpen: typeof toggleIngredientOpen;
    toggleIngredientMark: typeof toggleIngredientMark;
    updateIngredientAmount: typeof updateIngredientAmount;
    updateIngredientUnit: typeof updateIngredientUnit;
    updateAltIngredientAmount: typeof updateAltIngredientAmount;
    updateAltIngredientUnit: typeof updateAltIngredientUnit;
    updateAltNutritionFacts: typeof updateAltNutritionFacts;
    addIngredient: typeof addIngredient;
    addAltIngredient: typeof addAltIngredient;
}


export default class IngredientsBlock extends Component<Props> {
    public static readonly displayName = "IngredientsBlock";

    public static defaultProps = {
        isReadOnly: false,
    };

    // NOTE: Handlers - Ingredient

    private removeIngredient(id: string): void {
        this.props.removeIngredient(id);
    }

    private replaceIngredientWithAlternative(parentId: string, id: string): void {
        this.props.replaceIngredientWithAlternative(parentId, id);
    }

    private toggleIngredientOpen(id: string): void {
        this.props.toggleIngredientOpen(id);
    }

    private toggleIngredientMark(id: string): void {
        this.props.toggleIngredientMark(id);
    }

    private handleIngredientAmountEdit(id: string): InputChangeCallback {
        return (event) => {
            this.props.updateIngredientAmount(id, event.target.value);
        };
    }

    private handleIngredientUnitEdit(id: string): SelectChangeCallback {
        return (event) => {
            this.props.updateIngredientUnit(id, event.target.value as UnitWeight | UnitVolume);
        };
    }

    private addIngredient(): void {

        const { search, addIngredient } = this.props;

        const item = search.ingredients[Math.floor(Math.random() * search.ingredients.length)];
        
        addIngredient(item);
    }

    // NOTE: Handlers - AltIngredient

    private removeAltIngredient(parentId: string, id: string): void {
        this.props.removeAltIngredient(parentId, id);
    }

    private handleAltIngredientAmountEdit(parentId: string, id: string): InputChangeCallback {
        return (event) => {
            this.props.updateAltIngredientAmount(parentId, id, event.target.value);
        };
    }

    private handleAltIngredientUnitEdit(parentId: string, id: string): InputChangeCallback {
        return (event) => {
            this.props.updateAltIngredientUnit(parentId, id, event.target.value as UnitWeight | UnitVolume);
        };
    }

    private handleAltIngredientHover(parentId: string, id: string, inside: boolean): void {
        this.props.updateAltNutritionFacts(parentId, id, inside);
    }

    private addAltIngredient(id: string): void {

        const { search, addAltIngredient } = this.props;

        const item = search.ingredients[Math.floor(Math.random() * search.ingredients.length)];
        
        addAltIngredient(id, item);
    }
    
    // NOTE: Component parts

    private getIngredientInfoLineNutritionFacts(
        nutritionFacts: Dictionary<NutritionFactType, number>,
        altNutritionFacts: Dictionary<NutritionFactType, number> = {},
    ): JSX.Element {

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
                        <div
                            className={styles.ingredientInfoLineNutritionFactAmount}
                            style={(
                                Utils.objectIsNotEmpty(altNutritionFacts)
                                    ? { color: (nutritionFacts[type] > altNutritionFacts[type]) ? "#ff6e40" : "#008e76" }
                                    : null
                            )}
                        >
                            {( Utils.objectIsNotEmpty(altNutritionFacts) ? altNutritionFacts[type] : nutritionFacts[type] )}
                        </div>
                        <div className={styles.ingredientInfoLineNutritionFactType}>
                            {type.toUpperCase()}
                        </div>
                    </div>
                ) )}
            </div>
        );
    }

    private getIngredientInfoLine(ingredient: RecipeIngredientDefault, isNew: boolean = false): JSX.Element {

        const amountText = (
            <div className={styles.ingredientInfoLineAmountText}>
                {ingredient.amount}
            </div>
        );

        const amountInput = (
            <input
                type={"text"}
                className={styles.ingredientInfoLineAmountInput}
                value={(ingredient.amountInput || "")}
                onChange={this.handleIngredientAmountEdit(ingredient.item.id).bind(this)}
            />
        );

        const measureInput = (
            <div className={styles.ingredientInfoLineMeasure}>
                    
                {( this.props.isReadOnly ? amountText : amountInput )}
                
                <SelectInput
                    type={SelectInputType.IngredientUnit}
                    options={Object.keys(Units)}
                    value={ingredient.unit}
                    onChange={this.handleIngredientUnitEdit(ingredient.item.id).bind(this)}
                />
            </div>
        );

        return (
            <div
                key={ingredient.item.name}
                className={Utils.classNames({ [styles.ingredientInfoLine]: true, [styles.newIngredient]: isNew })}
            >

                <div
                    className={styles.ingredientInfoLineName}
                    style={( ingredient.isMarked ? { opacity: 0.25 } : null )}
                    onClick={() => this.toggleIngredientOpen(ingredient.item.id)}
                >
                    {ingredient.item.name.toUpperCase()}
                </div>

                {( isNew ? null : measureInput )}
            </div>
        );
    }

    private getAltIngredientLine(parentId: string, altIngredient: RecipeIngredient, isNew: boolean = false): JSX.Element {

        const { isReadOnly } = this.props;

        const removeButton = (
            <div
                className={styles.altIngredientLineButton}
                onClick={() => this.removeAltIngredient(parentId, altIngredient.item.id)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#fff"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const searchButton = (
            <div
                className={styles.altIngredientLineButton}
                onClick={() => this.addAltIngredient(parentId)}
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
                value={(altIngredient.amountInput|| "")}
                onChange={this.handleAltIngredientAmountEdit(parentId, altIngredient.item.id).bind(this)}
            />
        );

        const measureInput = (

            <div className={styles.ingredientInfoLineMeasure}>
                            
                {( isReadOnly ? amountText : amountInput )}
                
                <SelectInput
                    type={SelectInputType.AltIngredientUnit}
                    options={Object.keys(Units)}
                    value={altIngredient.unit}
                    onChange={this.handleAltIngredientUnitEdit(parentId, altIngredient.item.id).bind(this)}
                />
            </div>
        );

        const onClick = (): void => this.replaceIngredientWithAlternative(parentId, altIngredient.item.id);
        const onMouseEnter = (): void => this.handleAltIngredientHover(parentId, altIngredient.item.id, true);
        const onMouseLeave = (): void => this.handleAltIngredientHover(parentId, altIngredient.item.id, false);

        return (

            <div key={altIngredient.item.id} className={styles.altIngredientLine}>

                {( isReadOnly ? null : ( isNew ? searchButton : removeButton ) )}

                <div className={Utils.classNames({
                    [styles.altIngredientInfoLine]: true,
                    [styles.newIngredient]: isNew,
                })}>

                    <div
                        className={styles.ingredientInfoLineName}
                        onClick={isNew ? null : onClick}
                        onMouseEnter={isNew ? null : onMouseEnter}
                        onMouseLeave={isNew ? null : onMouseLeave}
                    >
                        {altIngredient.item.name.toUpperCase()}
                    </div>

                    {( isNew ? null : measureInput )}
                </div>
            </div>
        );
    }

    private getIngredientLine(ingredient: RecipeIngredientDefault, isNew: boolean = false): JSX.Element {

        const { isReadOnly } = this.props;

        const newAlt: RecipeIngredient = {
            amount: 100,
            amountInput: "100",
            unit: UnitWeight.g,
            item: {
                id: "NEW ALTERNATIVE",
                name: "NEW ALTERNATIVE",
                nutritionFacts: {},
            },
        };

        const checkbox = (
            <div
                className={styles.lineCheckbox}
                onClick={() => this.toggleIngredientMark(ingredient.item.id)}
            >
                {( ingredient.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
            </div>
        );

        const removeButton = (
            <div
                className={styles.ingredientLineButton}
                onClick={() => this.removeIngredient(ingredient.item.id)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const searchButton = (
            <div
                className={styles.ingredientLineButton}
                onClick={this.addIngredient.bind(this)}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <SearchIcon />
                </IconWrapper>
            </div>
        );

        const linkButton = (
            <Link
                to={Utils.getItemPath(RoutePath.Food, ingredient.item.id)}
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

            <div key={`ingredient_${ingredient.item.id}`} className={styles.ingredientLine}>

                {( isReadOnly ? checkbox : ( isNew ? searchButton : removeButton ) )}

                <div className={styles.ingredientInfoLines}>

                    {this.getIngredientInfoLine(ingredient, isNew)}

                    {(
                        ingredient.isOpen &&
                        this.getIngredientInfoLineNutritionFacts(ingredient.item.nutritionFacts, ingredient.altNutritionFacts)
                    )}

                    {( showSeparator && (<div className={styles.separator}></div>) )}

                    {(
                        showAlternativeIngredients &&
                        ingredient.alternatives.map((alt) => this.getAltIngredientLine(ingredient.item.id, alt, false))
                    )}

                    {( showNewAlternativeIngredient && this.getAltIngredientLine(ingredient.item.id, newAlt, true) )}

                </div>

                {linkButton}

            </div>
        );
    }


    public render(): JSX.Element {

        const { ingredients, isReadOnly } = this.props;

        const newIngredient: RecipeIngredientDefault = {

            isOpen: false,
            isMarked: false,

            item: {
                id: "new",
                name: "NEW INGREDIENT",
                nutritionFacts: {},
            },

            amount: 100,
            amountInput: "100",
            unit: UnitWeight.g,

            altNutritionFacts: {},

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
