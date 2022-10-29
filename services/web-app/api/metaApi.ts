import superagent from "superagent";

import type { NutrientMeta } from "@common/typings";


export default class MetaApi {

    private static readonly API_PATH: string = "/api/v1/meta";


    public static async getNutrients(): Promise<NutrientMeta> {

        const { body: nutrients } = await superagent.get(`${MetaApi.API_PATH}/nutrients`);

        return nutrients;
    }
}
