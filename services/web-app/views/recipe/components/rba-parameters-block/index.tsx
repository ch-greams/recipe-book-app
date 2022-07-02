import React from "react";
import { useDispatch } from "react-redux";

import type { InputChangeCallback } from "@common/typings";
import { Unit } from "@common/units";
import RbaCustomUnitsBlock from "@views/shared/rba-custom-units-block";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";

import styles from "./rba-parameters-block.module.scss";



interface ParametersBlockProps {
    recipe: RecipePageStore;
}

const RbaParametersBlock: React.FC<ParametersBlockProps> = ({ recipe }) => {

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
                    value={recipe.type}
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
                    value={recipe.servingSizeInput}
                    className={styles.servingSizeLineInput}
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
                customUnits={recipe.customUnits}
                addCustomUnit={actions.addCustomUnitRequest}
                removeCustomUnit={actions.removeCustomUnitRequest}
                updateCustomUnit={actions.updateCustomUnitRequest}
            />

        </div>
    );
};

RbaParametersBlock.displayName = "RbaParametersBlock";

export default RbaParametersBlock;
