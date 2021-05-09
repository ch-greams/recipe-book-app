import React from "react";
import { useDispatch } from "react-redux";

import { Units, VolumeUnit, WeightUnit } from "@common/units";
import CustomUnitsBlock from "@client/components/CustomUnitsBlock/CustomUnitsBlock";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import * as actions from "@client/store/recipe/actions";
import { RecipePageStore } from "@client/store/recipe/types";

import styles from "./RecipePage.scss";



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

    const handleServingSizeUnitEdit = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        dispatch(actions.updateServingSizeUnit(event.target.value as WeightUnit | VolumeUnit));
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
                    type={SelectInputType.Other}
                    options={Object.values(Units)}
                    value={recipeItem.servingSizeUnit}
                    onChange={handleServingSizeUnitEdit}
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
