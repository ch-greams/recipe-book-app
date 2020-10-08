import React, { Component } from "react";
import { Units, UnitVolume, UnitWeight } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import LinkIcon from "../../icons/link-sharp.svg";
import SearchIcon from "../../icons/search-sharp.svg";
import RemoveIcon from "../../icons/close-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import styles from "./IngredientsBlock.scss";
import { IngredientDefault, IngredientAlternative } from "../../store/recipe/types";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary, InputChangeCallback, SelectChangeCallback } from "../../../common/typings";
import Utils from "../../../common/utils";
import { AnyAction } from "redux";
import { Route } from "../Router";
import { Link } from "react-router-dom";



interface Props {
    isReadOnly: boolean;
    ingredients: IngredientDefault[];
    updateIngredients: (value: IngredientDefault[]) => AnyAction;
}


export default class IngredientsBlock extends Component<Props> {

    public static defaultProps = {
        isReadOnly: false,
    };

    // NOTE: Handlers

    private removeIngredient(id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.filter((ingredient) => ingredient.item.id !== id)
        );
    }

    private removeAltIngredient(parentId: string, id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.reduce<IngredientDefault[]>((acc, cur) => [
                ...acc,
                cur.item.id === parentId
                    ? {
                        ...cur,
                        alternatives: cur.alternatives.filter((alt) => alt.item.id !== id)
                    }
                    : cur
            ], [])
        );
    }

    private switchAltIngredientWithParent(parentId: string, id: string): void {

        const { ingredients, updateIngredients } = this.props;

        updateIngredients(
            ingredients.reduce<IngredientDefault[]>((acc, cur) => {

                if (cur.item.id === parentId) {

                    const alt = cur.alternatives.find((alt) => alt.item.id === id);
                    const newAlt: IngredientAlternative = {
                        amount: cur.amount,
                        amountInput: cur.amountInput,
                        unit: cur.unit,
                        item: cur.item,
                    };

                    return [
                        ...acc,
                        {
                            ...cur,
                            alternatives: [
                                ...cur.alternatives.filter((alt) => alt.item.id !== id),
                                newAlt,
                            ],
                            amount: alt.amount,
                            amountInput: alt.amountInput,
                            unit: alt.unit,
                            item: alt.item,
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
                isOpen: (ingredient.item.id === id) ? !ingredient.isOpen : ingredient.isOpen
            }))
        );
    }

    private handleIngredientAmountEdit(id: string): InputChangeCallback {

        const { ingredients, updateIngredients } = this.props;

        return (event) => {

            updateIngredients(
                ingredients.map((ingredient) => {

                    if (ingredient.item.id === id) {

                        const amount = Utils.decimalNormalizer(event.target.value, ingredient.amountInput);

                        return {
                            ...ingredient,
                            amountInput: amount,
                            amount: Number(amount),
                        };
                    }
                    else {
                        return ingredient;
                    }
                })
            );
        };
    }

    private handleIngredientUnitEdit(id: string): SelectChangeCallback {

        const { ingredients, updateIngredients } = this.props;

        return (event) => {

            updateIngredients(
                ingredients.map((ingredient) => (
                    (ingredient.item.id === id)
                        ? { ...ingredient, unit: event.target.value as UnitWeight | UnitVolume }
                        : ingredient
                ))
            );
        };
    }

    private handleAltIngredientAmountEdit(parentId: string, id: string): InputChangeCallback {

        const { ingredients, updateIngredients } = this.props;

        return (event) => {

            updateIngredients(
                ingredients.map((ingredient) => {

                    if (ingredient.item.id === parentId) {

                        return {
                            ...ingredient,
                            alternatives: ingredient.alternatives.map((alt) => {

                                const amount = Utils.decimalNormalizer(event.target.value, alt.amountInput);

                                if (alt.item.id === id) {
                                    return {
                                        ...alt,
                                        amountInput: amount,
                                        amount: Number(amount),
                                    };
                                }
                                else {
                                    return alt;
                                }
                            }),
                        };
                    }
                    else {
                        return ingredient;
                    }
                })
            );
        };
    }

    private handleAltIngredientUnitEdit(parentId: string, id: string): InputChangeCallback {

        const { ingredients, updateIngredients } = this.props;

        return (event) => {

            updateIngredients(
                ingredients.map((ingredient) => {

                    if (ingredient.item.id === parentId) {

                        return {
                            ...ingredient,
                            alternatives: ingredient.alternatives.map((alt) => (
                                (alt.item.id === id)
                                    ? {
                                        ...alt,
                                        unit: event.target.value as UnitWeight | UnitVolume,
                                    }
                                    : alt
                            )),
                        };
                    }
                    else {
                        return ingredient;
                    }
                })
            );
        };
    }

    // NOTE: Component parts

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

    private getIngredientInfoLine(ingredient: IngredientDefault, isNew: boolean = false): JSX.Element {

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
                    onClick={() => this.toggleIngredientOpen(ingredient.item.id)}
                >
                    {ingredient.item.name.toUpperCase()}
                </div>

                {( isNew ? null : measureInput )}
            </div>
        );
    }

    private getAltIngredientLine(parentId: string, altIngredient: IngredientAlternative, isNew: boolean = false): JSX.Element {

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

        return (

            <div key={altIngredient.item.id} className={styles.altIngredientLine}>

                {( isReadOnly ? null : ( isNew ? searchButton : removeButton ) )}

                <div className={Utils.classNames({
                    [styles.altIngredientInfoLine]: true,
                    [styles.newIngredient]: isNew,
                })}>

                    <div
                        className={styles.ingredientInfoLineName}
                        onClick={() => this.switchAltIngredientWithParent(parentId, altIngredient.item.id)}
                        onMouseEnter={() => console.log(`Entering ${parentId}/${altIngredient.item.id}`)}
                        onMouseLeave={() => console.log(`Leaving ${parentId}/${altIngredient.item.id}`)}
                    >
                        {altIngredient.item.name.toUpperCase()}
                    </div>

                    {( isNew ? null : measureInput )}
                </div>
            </div>
        );
    }

    private getIngredientLine(ingredient: IngredientDefault, isNew: boolean = false): JSX.Element {

        const { isReadOnly } = this.props;

        const newAlt: IngredientAlternative = {
            amount: 100,
            amountInput: "100",
            unit: UnitWeight.g,
            item: {
                id: "NEW ALTERNATIVE",
                name: "NEW ALTERNATIVE",
                nutritionFacts: {},
            }
        };

        const checkbox = (<div className={styles.lineCheckbox}></div>);

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
                onClick={() => console.log("TODO: Open modal for new ingredient search")}
            >
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <SearchIcon />
                </IconWrapper>
            </div>
        );

        const linkButton = (
            <Link
                to={Utils.getItemPath(Route.Food, ingredient.item.id)}
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

                    {( ingredient.isOpen && this.getIngredientInfoLineNutritionFacts(ingredient.item.nutritionFacts) )}

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

        const newIngredient: IngredientDefault = {

            isOpen: false,

            item: {
                id: "new",
                name: "NEW INGREDIENT",
                nutritionFacts: {},
            },

            amount: 100,
            amountInput: "100",
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
