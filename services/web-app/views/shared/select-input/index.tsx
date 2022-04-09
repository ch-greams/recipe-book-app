import type { PropsWithChildren, ReactElement } from "react";
import React from "react";
import * as constants from "cypress/constants";

import Utils from "@common/utils";

import { useToggleList } from "./hooks";

import styles from "./select-input.module.scss";


export enum SelectInputType {
    IngredientUnit,
    AltIngredientUnit,
    ServingSize,
    CustomUnit,
    SubDirectionType,
    Other,
}

export interface SelectOption<T> {
    group?: Option<string>;
    label?: Option<string>;
    value: T;
}

interface Props<T> {
    type: SelectInputType;
    withGroups?: boolean;
    options: SelectOption<T>[];
    value?: T;
    onChange: (option: SelectOption<T>) => void;
}


export const getOptionLabel = <T extends ID>(option: SelectOption<T>): string => {
    return Utils.unwrap(option.label, String(option.value));
};

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

const getOption = <T extends ID>(option: SelectOption<T>, onSelect: (option: SelectOption<T>) => void): JSX.Element => (
    <div
        data-cy={constants.CY_SELECT_INPUT_OPTION}
        key={option.value}
        className={styles.selectInputOption}
        onClick={() => onSelect(option)}
    >
        {getOptionLabel(option)}
    </div>
);

const getItemList = <T extends ID>(
    withGroups: boolean,
    options: SelectOption<T>[],
    onSelect: (option: SelectOption<T>) => void,
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

const SelectInput = <T extends ID>({
    type, options, value, onChange, withGroups = false,
}: PropsWithChildren<Props<T>>): ReactElement => {

    const { isListVisible, showList, hideList } = useToggleList();

    const onSelect = (option: SelectOption<T>): void => {
        onChange(option);
        hideList();
    };

    return (
        <div
            data-cy={constants.CY_SELECT_INPUT}
            className={getClassName(type)}
        >
            <div className={styles.selectInputOption} onClick={showList}>
                {value}
            </div>
            {( isListVisible && getItemList(withGroups, options, onSelect) )}
        </div>
    );
};

SelectInput.displayName = "SelectInput";

export default SelectInput;
