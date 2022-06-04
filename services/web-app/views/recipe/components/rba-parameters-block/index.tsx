import React from "react";
import { useDispatch } from "react-redux";

import type { InputChangeCallback } from "@common/typings";
import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import RbaCustomUnitsBlock from "@views/shared/rba-custom-units-block";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";

import styles from "./rba-parameters-block.module.scss";



interface ParametersBlockProps {
    recipeItem: RecipePageStore;
}

const RbaParametersBlock: React.FC<ParametersBlockProps> = ({ recipeItem }) => {

    const dispatch = useDispatch();

    const handleTypeEdit: InputChangeCallback = (event) => {
        dispatch(actions.updateType(event.target.value));
    };

    const handleServingSizeAmountEdit: InputChangeCallback = (event) => {
        dispatch(actions.updateServingSizeAmount(event.target.value));
    };

    return (

        <div className={styles.parametersBlock}>

            <div className={styles.typeSelect}>

                <div className={styles.typeSelectLabel}>
                    {"TYPE"}
                </div>

                <input
                    type={"text"}
                    value={recipeItem.type}
                    className={styles.typeSelectInput}
                    onChange={handleTypeEdit}
                />

            </div>

            <div className={styles.separator} />

            <div className={styles.servingSizeLine}>

                <div className={styles.servingSizeLineLabel}>
                    {"SERVING SIZE"}
                </div>

                <input
                    type={"text"}
                    value={recipeItem.servingSizeInput}
                    className={styles.servingSizeLineInput}
                    onChange={handleServingSizeAmountEdit}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(Units).map((unit) => ({ value: unit }))}
                    value={recipeItem.servingSizeUnit}
                    onChange={(option: SelectOption): void => {
                        dispatch(actions.updateServingSizeUnit(option.value as WeightUnit | VolumeUnit));
                    }}
                />

            </div>

            <div className={styles.separator} />

            <RbaCustomUnitsBlock
                customUnitInputs={recipeItem.customUnitInputs}
                addCustomUnit={actions.addCustomUnitRequest}
                removeCustomUnit={actions.removeCustomUnitRequest}
                updateCustomUnit={actions.updateCustomUnitRequest}
            />

        </div>
    );
};

RbaParametersBlock.displayName = "RbaParametersBlock";

export default RbaParametersBlock;
