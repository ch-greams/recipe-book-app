import { getUrlParams, Header, ResourceType } from "@common/http";
import type { JournalEntry, JournalEntryDetailed, JournalGroup, UserNutrient, UserNutrientDetailed } from "@common/typings";


export default class JournalApi {

    private static readonly API_PATH: string = "/api/v1/journal";


    public static async getJournalEntries(date: string): Promise<JournalEntryDetailed[]> {

        const params = getUrlParams({ entry_date: date, user_id: 1 });

        const response = await fetch(`${JournalApi.API_PATH}/entry?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        const entries: JournalEntryDetailed[] = await response.json();

        return entries;
    }

    public static async getJournalGroups(): Promise<JournalGroup[]> {

        const params = getUrlParams({ user_id: 1 });

        const response = await fetch(`${JournalApi.API_PATH}/groups?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        const groups: JournalGroup[] = await response.json();

        return groups;
    }

    public static async updateJournalGroups(journalGroups: JournalGroup[]): Promise<void> {

        await fetch(`${JournalApi.API_PATH}/groups/update`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify(journalGroups),
        });
    }

    public static async createJournalEntry(journalEntry: JournalEntry): Promise<JournalEntryDetailed> {

        const response = await fetch(`${JournalApi.API_PATH}/entry/create`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(journalEntry),
        });

        const entry: JournalEntryDetailed = await response.json();

        return entry;
    }

    public static async updateJournalEntry(journalEntry: JournalEntry): Promise<JournalEntry> {

        const response = await fetch(`${JournalApi.API_PATH}/entry/update`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(journalEntry),
        });

        const entry: JournalEntry = await response.json();

        return entry;
    }

    public static async deleteJournalEntry(journalEntryId: number): Promise<void> {

        await fetch(`${JournalApi.API_PATH}/entry/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: journalEntryId }),
        });
    }

    public static async getUserNutrients(): Promise<UserNutrientDetailed[]> {

        const params = getUrlParams({ user_id: 1 });

        const response = await fetch(`${JournalApi.API_PATH}/nutrients?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        const nutrients: UserNutrientDetailed[] = await response.json();

        return nutrients;
    }

    public static async upsertUserNutrient(userNutrient: UserNutrient): Promise<UserNutrientDetailed> {

        const response = await fetch(`${JournalApi.API_PATH}/nutrient/upsert`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(userNutrient),
        });

        const nutrient: UserNutrientDetailed = await response.json();

        return nutrient;
    }

    public static async deleteUserNutrient(userNutrientId: number): Promise<void> {

        const params = getUrlParams({ user_id: 1 });

        await fetch(`${JournalApi.API_PATH}/nutrient/delete?${params}`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: userNutrientId }),
        });
    }
}
