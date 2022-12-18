import { Header, HttpError, ResourceType } from "@common/http";


export default class AuthApi {

    private static readonly API_PATH: string = "/auth/api/v1";


    public static async login(username: string, password: string): Promise<void> {

        const response = await fetch(`${AuthApi.API_PATH}/login`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.X_WWW_FORM_URLENCODED },
            body: new URLSearchParams({ username, password }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }

    public static async signup(
        email: string, firstName: string, lastName: string, password: string,
    ): Promise<void> {

        const response = await fetch(`${AuthApi.API_PATH}/signup`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.X_WWW_FORM_URLENCODED },
            body: new URLSearchParams({
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }
}
