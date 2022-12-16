import type { Response } from "@common/http";
import { Header, HttpStatus, ResourceType } from "@common/http";
import type { NutrientMeta } from "@common/typings";


export default class MetaApi {

    private static readonly API_PATH: string = "/api/v1/meta";


    public static async getNutrients(): Promise<Response<NutrientMeta[]>> {

        try {
            const response = await fetch(`${MetaApi.API_PATH}/nutrients`, {
                method: "GET",
                headers: { [Header.ACCEPT]: ResourceType.JSON },
            });

            if (response.ok) {
                const nutrients: NutrientMeta[] = await response.json();
                return { status: response.status, body: nutrients };
            }

            return { status: response.status, body: null };
        }
        catch (error) {
            return { status: HttpStatus.InternalServerError, body: null };
        }
    }
}
