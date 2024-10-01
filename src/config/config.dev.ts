import Config, {Env} from "./config.types";
import {DataQueryResultFunction} from "../components/DataTable/types";
import csuClient from "../network";

const config: Config = {
    appName: 'Piramide',
    env: (process.env.REACT_APP_ENV as Env),
    language: {
        defaultValue: 'fr',
        available: ['en', 'fr'],
    },

    storagePrefix: 'myMynepat__',
    //piramideClient: 'http://3.137.55.229:8015/api',
    piramideClient: 'http://10.10.10.18:8089/v1',

    ui: {
        breakingPointSize: {
            mobile: Number(process.env.REACT_APP_MOBILE_BREAKPOINT_SIZE) || 768,
            aside: Number(process.env.REACT_APP_ASIDE_MINIMIZE_BREAKPOINT_SIZE) || 1024
        }
    },
    dataTable: {
        defaultPageSize: 10,
    }
};

export default config;

