import { HttpError } from "@common/http";
import { getUrlParams, Header, ResourceType } from "@common/http";
import type { JournalEntry, JournalEntryDetailed, JournalGroup, UserNutrient, UserNutrientDetailed } from "@common/typings";


export default class JournalApi {

    private static readonly API_PATH: string = "/api/v1/journal";


    public static async getJournalEntries(date: string): Promise<JournalEntryDetailed[]> {

        const params = getUrlParams({ entry_date: date });

        const response = await fetch(`${JournalApi.API_PATH}/entry?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const entries: JournalEntryDetailed[] = await response.json();
            return entries;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async updateJournalGroups(journalGroups: JournalGroup[]): Promise<void> {

        const response = await fetch(`${JournalApi.API_PATH}/groups/update`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify(journalGroups),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
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

        if (response.ok) {
            const entry: JournalEntryDetailed = await response.json();
            return entry;
        }
        else {
            throw new HttpError(response.status);
        }
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

        if (response.ok) {
            const entry: JournalEntry = await response.json();
            return entry;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async deleteJournalEntry(journalEntryId: number): Promise<void> {

        const response = await fetch(`${JournalApi.API_PATH}/entry/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: journalEntryId }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
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

        if (response.ok) {
            const nutrient: UserNutrientDetailed = await response.json();
            return nutrient;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async deleteUserNutrient(userNutrientId: number): Promise<void> {

        const response = await fetch(`${JournalApi.API_PATH}/nutrient/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: userNutrientId }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }
}
