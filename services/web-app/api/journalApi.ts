import superagent from "superagent";

import type { JournalEntry, JournalEntryDetailed, JournalGroup, UserNutrient, UserNutrientDetailed } from "@common/typings";
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

    public static async updateJournalGroups(journalGroups: JournalGroup[]): Promise<void> {

        await superagent.post(`${JournalApi.API_PATH}/groups/update`).send(journalGroups);
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

    public static async getUserNutrients(): Promise<UserNutrientDetailed[]> {

        const params = Utils.getUrlParams({ user_id: 1 });

        const { body: nutrients } = await superagent.get(`${JournalApi.API_PATH}/nutrients?${params}`);

        return nutrients;
    }

    public static async upsertUserNutrient(userNutrient: UserNutrient): Promise<UserNutrientDetailed> {

        const { body: nutrient } = await superagent.post(`${JournalApi.API_PATH}/nutrient/upsert`)
            .send(userNutrient);

        return nutrient;
    }

    public static async deleteUserNutrient(userNutrientId: number): Promise<void> {

        const params = Utils.getUrlParams({ user_id: 1 });

        await superagent.post(`${JournalApi.API_PATH}/nutrient/delete?${params}`).send({ id: userNutrientId });
    }
}
