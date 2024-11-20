import config from '../config';
import customAxios from './axiosConfig';
import Client from './pyramideClient';

/**
 * Client class generic for centralization purpose
 * Some general code can be written here
 */
class PiramideClient extends Client {}

// Create client class
const piramideClient = new PiramideClient(config.piramideClient, customAxios);

// Use csuClient by default
export default piramideClient;
