import { HttpError } from "@common/http";
import { Header, ResourceType } from "@common/http";
import type { UserInfo } from "@common/typings";



export default class UserApi {

    private static readonly API_PATH: string = "/api/v1/user";


    public static async getUserInfo(): Promise<UserInfo> {

        const response = await fetch(`${UserApi.API_PATH}/info`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const info: UserInfo = await response.json();
            return info;
        }
        else {
            throw new HttpError(response.status);
        }
    }
}
