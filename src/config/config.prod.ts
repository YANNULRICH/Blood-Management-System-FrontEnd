import Config from "./config.types";
import configDev from './config.dev';

const config: Config = {
    ...configDev,
    /* OVERRIDE HERE ONLY NECESSARY CONFIG ! */
};

export default config;