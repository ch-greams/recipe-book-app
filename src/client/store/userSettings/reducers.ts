import {
    USER_SETTINGS_CHANGE_PAGE,
    UserSettingsActionTypes,
    UserSettings,
} from "./types";
import { Page } from "../../components/Router";



const initialState: UserSettings = {

    page: Page.Food,
};


export default function userReducer(state = initialState, action: UserSettingsActionTypes): UserSettings {

    switch (action.type) {

        case USER_SETTINGS_CHANGE_PAGE: {
            return {
                ...state,
                page: action.payload,
            };
        }

        default:
            return state;
    }
}
