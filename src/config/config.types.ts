import {LanguageDict} from "../commons/types";

export enum Env {
    local = "local",
    prod = "prod",
}

export default interface Config {
    appName: string;
    env: Env;
    storagePrefix: string;
    piramideClient: string;
    language: {
        defaultValue: LanguageDict,
        available: LanguageDict[],
    },
    ui: {
        breakingPointSize: {
            mobile: number,
            aside: number,
        }
    },
    dataTable: {
        defaultPageSize: number,
    }
}
