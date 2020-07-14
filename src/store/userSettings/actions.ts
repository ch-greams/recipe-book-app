import {
    USER_SETTINGS_CHANGE_PAGE,
    UserSettingsActionTypes,
    Page,
} from "./types";



export function changePage(page: Page): UserSettingsActionTypes {
    return {
        type: USER_SETTINGS_CHANGE_PAGE,
        payload: page,
    };
}
