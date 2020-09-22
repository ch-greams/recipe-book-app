import { Page } from "../../components/Router";


export interface UserSettings {
    page: Page;
}


export const USER_SETTINGS_CHANGE_PAGE = "USER_SETTINGS_CHANGE_PAGE";


interface ChangePageAction {
    type: typeof USER_SETTINGS_CHANGE_PAGE;
    payload: Page;
}


export type UserSettingsActionTypes = (
    ChangePageAction
);

