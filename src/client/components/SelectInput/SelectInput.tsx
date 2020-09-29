import React, { Component } from "react";
import Utils from "../../../common/utils";
import styles from "./SelectInput.scss";


export enum SelectInputType {
    IngredientUnit,
    AltIngredientUnit,
}


interface Props {
    type?: SelectInputType;
    options: string[];
}

// TODO: Add current value for selected
class SelectInput extends Component<Props> {

    private getClassName(type?: SelectInputType): string {

        switch (type) {
            case SelectInputType.IngredientUnit:
                return Utils.classNames({
                    [styles.selectInput]: true,
                    [styles.ingredientUnit]: true,
                });
            case SelectInputType.AltIngredientUnit:
                return Utils.classNames({
                    [styles.selectInput]: true,
                    [styles.altIngredientUnit]: true,
                });
            default:
                return styles.selectInput;
        }
    }

    public render(): JSX.Element {

        const { type, options } = this.props;

        return (
            <select className={this.getClassName(type)}>
                {options.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }
}

export default SelectInput;