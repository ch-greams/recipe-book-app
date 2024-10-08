import React from "react";

import type { CustomUnitInput } from "@common/units";
import { Unit, VolumeUnit, WeightUnit } from "@common/units";
import RbaCustomUnitsBlock from "@views/shared/rba-custom-units-block";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipePageStore } from "@store/types/recipe";

import styles from "./rba-parameters-block.module.scss";



interface Props {
    recipe: RecipePageStore;
}

const RbaParametersBlock: React.FC<Props> = ({ recipe }) => {

    const dispatch = useAppDispatch();

    const handleTypeEdit: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateType(value));
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

            <div className={styles.densityLine}>

                {/* BULK DENSITY */}

                <div
                    className={styles.densityLineLabel}
                    title={"Use Bulk Density for foods like rice or beans"}
                >
                    {"DENSITY"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Large}
                    height={InputHeightSize.Large}
                    disabled={!recipe.editMode}
                    value={recipe.densityInput}
                    normalizer={InputNormalizer.Decimal}
                    onChange={(value) => { dispatch(actions.updateDensityAmount(value)); }}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(WeightUnit).map((unit) => ({ value: unit }))}
                    onChange={(option: SelectOption) => dispatch(actions.updateDensityWeightUnit(option.value as WeightUnit))}
                    value={recipe.densityWeightUnit}
                />

                <span className={styles.densityLineUnitSeparator}>
                    {"in"}
                </span>

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(VolumeUnit).map((unit) => ({ value: unit }))}
                    onChange={(option: SelectOption) => dispatch(actions.updateDensityVolumeUnit(option.value as VolumeUnit))}
                    value={recipe.densityVolumeUnit}
                />

            </div>

            <div className={styles.servingSizeLine}>

                <div className={styles.servingSizeLineLabel}>
                    {"SERVING SIZE"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Large}
                    height={InputHeightSize.Large}
                    value={recipe.servingSizeInput}
                    normalizer={InputNormalizer.Decimal}
                    onChange={(value) => { dispatch(actions.updateServingSizeAmount(value)); }}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={[
                        ...Object.values(Unit).map((unit) => ({ value: unit })),
                        ...recipe.customUnits.map((customUnit) => ({ value: customUnit.name })),
                    ]}
                    value={recipe.servingSizeUnit}
                    onChange={(option) => { dispatch(actions.updateServingSizeUnit(option.value as Unit)); }}
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
