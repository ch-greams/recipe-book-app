import React from "react";
import { useDispatch } from "react-redux";

import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import CustomUnitsBlock from "@views/shared/CustomUnitsBlock";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipePageStore } from "@store/recipe/types";

import styles from "./RecipePage.module.scss";



interface ParametersBlockProps {
    recipeItem: RecipePageStore;
}

const ParametersBlock: React.FC<ParametersBlockProps> = ({ recipeItem }) => {

    const dispatch = useDispatch();

    const handleTypeEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        dispatch(actions.updateType(event.target.value));
    };

    const handleServingSizeAmountEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
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

                <SelectInput
                    type={SelectInputType.ServingSize}
                    options={Object.values(Units).map((unit) => ({ value: unit }))}
                    value={recipeItem.servingSizeUnit}
                    onChange={(value: WeightUnit | VolumeUnit): void => {
                        dispatch(actions.updateServingSizeUnit(value));
                    }}
                />

            </div>

            <div className={styles.separator} />

            <CustomUnitsBlock
                customUnitInputs={recipeItem.customUnitInputs}
                addCustomUnitRequest={actions.addCustomUnitRequest}
                removeCustomUnitRequest={actions.removeCustomUnitRequest}
                updateCustomUnitRequest={actions.updateCustomUnitRequest}
            />

        </div>
    );
};

ParametersBlock.displayName = "ParametersBlock";

export default ParametersBlock;
