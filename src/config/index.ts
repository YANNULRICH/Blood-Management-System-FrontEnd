import configDev from './config.dev';
import configProd from './config.prod';

const config = (function () {
    switch (process.env.REACT_APP_ENV) {
        case 'prod':
            return configProd;
        default:
            return configDev;
    }
})();

export default config;