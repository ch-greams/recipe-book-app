import Utils from "../../common/utils";
import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodItem,
} from "./types";



const initialState: FoodItem = {

    name: Utils.getTestName(),
};


export default function dashboardReducer(state = initialState, action: FoodItemActionTypes): FoodItem {

    switch (action.type) {

        case FOOD_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        default:
            return state;
    }
}
