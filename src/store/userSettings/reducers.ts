import {
    USER_SETTINGS_CHANGE_PAGE,
    UserSettingsActionTypes,
    UserSettings,
    Page,
} from "./types";



const initialState: UserSettings = {

    page: Page.Home,
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
