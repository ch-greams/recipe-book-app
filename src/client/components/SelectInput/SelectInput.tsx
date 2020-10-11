import React, { Component } from "react";
import { SelectChangeCallback } from "../../../common/typings";
import Utils from "../../../common/utils";
import styles from "./SelectInput.scss";


export enum SelectInputType {
    IngredientUnit,
    AltIngredientUnit,
    CustomUnit,
}


interface Props {
    type?: SelectInputType;
    options: string[];
    value?: string;
    onChange: SelectChangeCallback;
}

// TODO: Add current value for selected
export default class SelectInput extends Component<Props> {
    public static readonly displayName = "SelectInput";

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
            case SelectInputType.CustomUnit:
                return Utils.classNames({
                    [styles.selectInput]: true,
                    [styles.customUnit]: true,
                });
            default:
                return styles.selectInput;
        }
    }

    public render(): JSX.Element {

        const { type, options, value, onChange } = this.props;

        return (
            <select
                className={this.getClassName(type)}
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }
}
