import fs from "fs";
import path from "path";


export default class FileSystem {

    private static readonly DEFAULT_READ_FILE_OPTIONS = "utf8";


    public static getPath(file: string): string {

        return path.join(__dirname, "..", "..", "data", file);
    }

    public static fileExists(path: string): boolean {
        return fs.existsSync(path);
    }

    public static async readJsonFileAsync<T>(path: string): Promise<T> {
        const rawJsonString = await fs.promises.readFile(path, FileSystem.DEFAULT_READ_FILE_OPTIONS) as string;
        return JSON.parse(rawJsonString);
    }

}
