import superagent from "superagent";

import type { JournalEntry, JournalEntryDetailed, JournalGroup } from "@common/typings";
import Utils from "@common/utils";


export default class JournalApi {

    private static readonly API_PATH: string = "/api/v1/journal";


    public static async getJournalEntries(date: string): Promise<JournalEntryDetailed[]> {

        const params = Utils.getUrlParams({ entry_date: date, user_id: 1 });

        const { body: entries } = await superagent.get(`${JournalApi.API_PATH}/entry?${params}`);

        return entries;
    }

    public static async getJournalGroups(): Promise<JournalGroup[]> {

        const params = Utils.getUrlParams({ user_id: 1 });

        const { body: groups } = await superagent.get(`${JournalApi.API_PATH}/groups?${params}`);

        return groups;
    }

    public static async createJournalEntry(journalEntry: JournalEntry): Promise<JournalEntryDetailed> {

        const { body: entry } = await superagent.post(`${JournalApi.API_PATH}/entry/create`)
            .send(journalEntry);

        return entry;
    }

    public static async updateJournalEntry(journalEntry: JournalEntry): Promise<JournalEntry> {

        const { body: entry } = await superagent.post(`${JournalApi.API_PATH}/entry/update`)
            .send(journalEntry);

        return entry;
    }

    public static async deleteJournalEntry(journalEntryId: number): Promise<void> {

        await superagent.post(`${JournalApi.API_PATH}/entry/delete`).send({ id: journalEntryId });
    }
}
