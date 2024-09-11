import React from 'react';
import {AxiosError} from "axios";
import BadRequest400 from "./BadRequest400";
import ConnexionExpired401 from "./ConnexionExpired401";
import ResourceNotFound404 from "./ResourceNotFound404";
import FetchFailedComponent from "../requests/FetchFailedComponent";
import Forbidden403 from './ConnexionExpired403';

export type ErrorRequestComponentProps = {
    error?: any;
    loadData?: any;
}

/**
 * Handle error and display
 * @param error
 * @param loadData
 * @constructor
 */
const ErrorRequestComponent = ({ error, loadData }: ErrorRequestComponentProps) => {
    // Safely define error
    const _error = error || new Error("");

    if (!error
        || (_error && !(_error instanceof AxiosError))
        || (_error && !_error.response)) {
        return <FetchFailedComponent onRetryClick={loadData} />;
    }

    if (_error.response && _error.response.status === 400) {
        return <BadRequest400 />;
    }

    if (_error.response && _error.response.status === 401) {
        return <ConnexionExpired401 />;
    }

    if (_error.response && _error.response.status === 403) {
        return <Forbidden403 />;
    }

    if (_error.response && _error.response.status === 404) {
        return <ResourceNotFound404 />;
    }

    return <FetchFailedComponent onRetryClick={loadData} />;
};

export default ErrorRequestComponent;
