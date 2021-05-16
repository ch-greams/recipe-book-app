import React from "react";

import { Option } from "@common/typings";
import Utils from "@common/utils";

import { useToggleList } from "./hooks";

import styles from "./SelectInput.scss";


export enum SelectInputType {
    IngredientUnit,
    AltIngredientUnit,
    ServingSize,
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
    onChange: (value: string) => void;
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
        case SelectInputType.ServingSize:
            return Utils.classNames({
                [styles.selectInput]: true,
                [styles.servingSize]: true,
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

const getOption = (option: SelectOption, onSelect: (value: string) => void): JSX.Element => (
    <div
        key={option.value}
        className={styles.selectInputOption}
        onClick={() => onSelect(option.value)}
    >
        {Utils.unwrap(option.label, option.value)}
    </div>
);

const getItemList = (
    withGroups: boolean,
    options: SelectOption[],
    onSelect: (value: string) => void,
): JSX.Element => (
    <div className={styles.selectInputList}>
        {(
            withGroups
                ? options
                    .map((option) => option.group)
                    .unique()
                    .flatMap((group) => ([
                        <div key={group} className={styles.selectInputGroupName}>
                            {`- ${group}`}
                        </div>,
            
                        ...options
                            .filter((option) => (option.group === group))
                            .map((option) => getOption(option, onSelect)),
                    ]))
                : options.map((option) => getOption(option, onSelect))
        )}
    </div>
);

const SelectInput: React.FC<Props> = ({ type, options, value, onChange, withGroups = false }) => {

    const { isListVisible, showList, hideList } = useToggleList();

    const onSelect = (option: string): void => {
        onChange(option);
        hideList();
    };

    return (
        <div className={getClassName(type)}>
            <div className={styles.selectInputOption} onClick={showList}>
                {value}
            </div>
            {( isListVisible && getItemList(withGroups, options, onSelect) )}
        </div>
    );
};

SelectInput.displayName = "SelectInput";

export default SelectInput;
