import { Header, ResourceType } from "@common/http";


export default class AuthApi {

    private static readonly API_PATH: string = "/auth/api/v1";


    public static async login(username: string, password: string): Promise<void> {

        await fetch(`${AuthApi.API_PATH}/login`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.X_WWW_FORM_URLENCODED },
            body: new URLSearchParams({ username, password }),
        });
    }
}
