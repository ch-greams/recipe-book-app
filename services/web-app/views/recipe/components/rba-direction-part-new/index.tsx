import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import Utils from "@common/utils";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import { getOptionLabel, SelectHeightSize, SelectWidthSize } from "@views/shared/rba-select";
import RbaSelect, { SelectTheme } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient } from "@store/recipe/types";
import { DirectionPartType } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";

import styles from "./rba-direction-part-new.module.scss";



interface Props {
    directionIndex: number;
    ingredients: RecipeIngredient[];
}

const RbaDirectionPartNew: React.FC<Props> = ({ directionIndex, ingredients }) => {

    const dispatch = useDispatch();

    const [ currentDirectionPart, setDirectionPart ] = useState<SelectOption>({
        group: "Comment",
        value: DirectionPartType.Note,
    });

    const createDirectionPart = (): void => {
        if (currentDirectionPart.group === "Comment") {
            dispatch(actions.createDirectionPartComment(directionIndex, currentDirectionPart.value as DirectionPartType));
        }
        else {
            dispatch(actions.createDirectionPartIngredient(directionIndex, Number(currentDirectionPart.value)));
        }
    };

    const otherDirectionPartTypes = [
        DirectionPartType.Tip,
        DirectionPartType.Note,
        DirectionPartType.Warning,
    ];

    return (

        <div
            data-cy={constants.CY_DIRECTION_PART_NEW}
            className={styles.directionPart}
        >

            <div
                data-cy={constants.CY_DIRECTION_PART_NEW_CREATE_BUTTON}
                className={styles.directionPartButton}
                onClick={createDirectionPart}
            >
                <RbaIconWrapper
                    isFullWidth={true}
                    width={24} height={24} color={Color.White}
                    style={{ transform: "rotate(0.125turn)" }}
                >
                    <RemoveIcon />
                </RbaIconWrapper>
            </div>

            <div className={styles.directionPartInfo}>

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    width={SelectWidthSize.Full}
                    height={SelectHeightSize.Medium}
                    options={[
                        ...ingredients.map((ingredient) => ({
                            group: "Ingredients",
                            label: Utils.unwrap(
                                ingredient.products[ingredient.product_id],
                                `ingredient.products["${ingredient.product_id}"]`,
                            ).name.toUpperCase(),
                            value: String(ingredient.id),
                        })),
                        ...otherDirectionPartTypes.map((type) => ({ group: "Comment", value: type })),
                    ]}
                    value={getOptionLabel(currentDirectionPart)}
                    onChange={setDirectionPart}
                />

            </div>
        </div>
    );
};

RbaDirectionPartNew.displayName = "RbaDirectionPartNew";

export default RbaDirectionPartNew;
