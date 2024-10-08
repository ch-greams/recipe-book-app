import { HttpError } from "@common/http";
import { Header, ResourceType } from "@common/http";
import type { NutrientMeta } from "@common/typings";


export default class MetaApi {

    private static readonly API_PATH: string = "/api/v1/meta";


    public static async getNutrients(): Promise<NutrientMeta[]> {

        const response = await fetch(`${MetaApi.API_PATH}/nutrients`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const nutrients: NutrientMeta[] = await response.json();
            return nutrients;
        }
        else {
            throw new HttpError(response.status);
        }
    }
}
