import superagent from "superagent";

import type { JournalEntry, JournalGroup } from "@common/typings";
import Utils from "@common/utils";


export default class JournalApi {

    private static readonly API_PATH: string = "/api/v1/journal";


    public static async getJournalEntries(date: string): Promise<JournalEntry[]> {

        const params = Utils.getUrlParams({ entry_date: date, user_id: 1 });

        const { body: entries } = await superagent.get(`${JournalApi.API_PATH}/entry?${params}`);

        return entries;
    }

    public static async getJournalGroups(): Promise<JournalGroup[]> {

        const params = Utils.getUrlParams({ user_id: 1 });

        const { body: groups } = await superagent.get(`${JournalApi.API_PATH}/groups?${params}`);

        return groups;
    }
}
