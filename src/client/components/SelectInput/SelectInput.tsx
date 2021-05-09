import React from "react";

import { Option, SelectChangeCallback } from "@common/typings";
import Utils from "@common/utils";

import styles from "./SelectInput.scss";


export enum SelectInputType {
    IngredientUnit,
    AltIngredientUnit,
    CustomUnit,
    SubDirectionType,
    Other,
}

interface SelectOption {
    group?: Option<string>;
    label?: Option<string>;
    value: string;
}

interface Props {
    type: SelectInputType;
    withGroups?: boolean;
    options: SelectOption[];
    value?: string;
    onChange: SelectChangeCallback;
}


const getClassName = (type: SelectInputType): string => {

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
        case SelectInputType.Other:
            return styles.selectInput;
    }
};

const getGroupedOptionElements = (options: SelectOption[]): JSX.Element[] => {

    const groups = [ ...new Set(options.map((option) => option.group)) ];

    return groups.flatMap((group) => ([
        <option key={group} style={{ color: "#fff" }} disabled={true}>{`- ${group}`}</option>,

        ...options.filter((option) => (option.group === group)).map((option) => (
            <option key={option.value} value={option.value}>
                {Utils.unwrap(option.label, option.value)}
            </option>
        )),
    ]));
};

const getOptionElements = (options: SelectOption[]): JSX.Element[] => {

    return options.map((option) => (
        <option key={option.value} value={option.value}>
            {Utils.unwrap(option.label, option.value)}
        </option>
    ));
};

const SelectInput: React.FC<Props> = ({ type, options, value, onChange, withGroups = false }) => {
    
    return (
        <select
            className={getClassName(type)}
            value={value}
            onChange={onChange}
        >
            {( withGroups ? getGroupedOptionElements(options) : getOptionElements(options) )}
        </select>
    );
};

SelectInput.displayName = "SelectInput";

export default SelectInput;
