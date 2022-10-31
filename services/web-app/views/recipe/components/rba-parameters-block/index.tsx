import React from "react";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput } from "@common/units";
import { Unit } from "@common/units";
import RbaCustomUnitsBlock from "@views/shared/rba-custom-units-block";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { useAppDispatch } from "@store";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";

import styles from "./rba-parameters-block.module.scss";



interface ParametersBlockProps {
    recipe: RecipePageStore;
}

const RbaParametersBlock: React.FC<ParametersBlockProps> = ({ recipe }) => {

    const dispatch = useAppDispatch();

    const handleTypeEdit: InputChangeCallback = (event) => {
        dispatch(actions.updateType(event.target.value));
    };

    const handleServingSizeAmountEdit: InputChangeCallback = (event) => {
        dispatch(actions.updateServingSizeAmount(event.target.value));
    };

    const addCustomUnit = (customUnit: CustomUnitInput): void => {
        dispatch(actions.addCustomUnit(customUnit));
    };
    const removeCustomUnit = (index: number): void => {
        dispatch(actions.removeCustomUnit(index));
    };
    const updateCustomUnit = (index: number, customUnit: CustomUnitInput): void => {
        dispatch(actions.updateCustomUnit({ index, customUnit }));
    };

    return (

        <div className={styles.parametersBlock}>

            <div className={styles.typeSelect}>

                <div className={styles.typeSelectLabel}>
                    {"TYPE"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    disabled={!recipe.editMode}
                    value={recipe.type}
                    onChange={handleTypeEdit}
                />

            </div>

            <div className={styles.separator} />

            <div className={styles.servingSizeLine}>

                <div className={styles.servingSizeLineLabel}>
                    {"SERVING SIZE"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Large}
                    height={InputHeightSize.Large}
                    value={recipe.servingSizeInput}
                    onChange={handleServingSizeAmountEdit}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(Unit).map((unit) => ({ value: unit }))}
                    value={recipe.servingSizeUnit}
                    onChange={(option: SelectOption): void => {
                        dispatch(actions.updateServingSizeUnit(option.value as Unit));
                    }}
                />

            </div>

            <div className={styles.separator} />

            <RbaCustomUnitsBlock
                isReadOnly={!recipe.editMode}
                customUnits={recipe.customUnits}
                addCustomUnit={addCustomUnit}
                removeCustomUnit={removeCustomUnit}
                updateCustomUnit={updateCustomUnit}
            />

        </div>
    );
};

RbaParametersBlock.displayName = "RbaParametersBlock";

export default RbaParametersBlock;
