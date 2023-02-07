import React, { useState } from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/style";
import { getOptionLabel, SelectHeightSize, SelectWidthSize } from "@views/shared/rba-select";
import RbaSelect, { SelectTheme } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeIngredient } from "@store/types/recipe";
import { DirectionPartType } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconAdd from "@icons/rba-icon-add";

import styles from "./rba-direction-part-new.module.scss";



interface Props {
    directionIndex: number;
    ingredients: RecipeIngredient[];
}

const RbaDirectionPartNew: React.FC<Props> = ({ directionIndex, ingredients }) => {

    const dispatch = useAppDispatch();

    const [ currentDirectionPart, setDirectionPart ] = useState<SelectOption>({
        group: "Comment",
        value: DirectionPartType.Note,
    });

    const createDirectionPart = (): void => {
        if (currentDirectionPart.group === "Comment") {
            dispatch(actions.createDirectionPartComment({ directionIndex, type: currentDirectionPart.value as DirectionPartType }));
        }
        else {
            dispatch(actions.createDirectionPartIngredient({ directionIndex, ingredientNumber: Number(currentDirectionPart.value) }));
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
                <RbaIconAdd size={IconSize.Medium} color={Color.White} />
            </div>

            <div className={styles.directionPartInfo}>

                <RbaSelect
                    data-cy={constants.CY_SELECT_INPUT}
                    theme={SelectTheme.Alternative}
                    width={SelectWidthSize.Full}
                    height={SelectHeightSize.Medium}
                    options={[
                        ...ingredients.map((ingredient) => ({
                            group: "Ingredients",
                            label: ingredient.name,
                            value: String(ingredient.slot_number),
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
