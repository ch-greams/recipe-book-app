import {
    USER_SETTINGS_CHANGE_PAGE,
    UserSettingsActionTypes,
} from "./types";
import { Page } from "../../components/Router";



export function changePage(page: Page): UserSettingsActionTypes {
    return {
        type: USER_SETTINGS_CHANGE_PAGE,
        payload: page,
    };
}
