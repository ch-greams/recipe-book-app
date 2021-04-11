import React, { Component } from "react";
import { SelectChangeCallback } from "@common/typings";
import Utils from "@common/utils";
import styles from "./SelectInput.scss";


export enum SelectInputType {
    IngredientUnit,
    AltIngredientUnit,
    CustomUnit,
    SubDirectionType,
}

interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    type?: SelectInputType;
    options: (string | SelectOption)[];
    value?: string;
    onChange: SelectChangeCallback;
}


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
            case SelectInputType.SubDirectionType:
                return Utils.classNames({
                    [styles.selectInput]: true,
                    [styles.subDirectionType]: true,
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
                    (typeof option === "string")
                        ? (
                            (option === "----")
                                ? <option key={option} disabled={true}>{option}</option>
                                : <option key={option} value={option}>{option}</option>
                        )
                        : <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        );
    }
}
