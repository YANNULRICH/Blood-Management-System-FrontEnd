import React from 'react';

import config from "../../config";
import BaseRequest from "./BaseRequest";
import IntlMessages from "../IntlMessages";
import {Env} from "../../config/config.types";

export type SomethingWentWrong500Error = {
    errorMessage?: string,
    stacktrace?: string,
}

/**
 *
 * @param errorMessage
 * @param stacktrace
 * @constructor
 */
const SomethingWentWrong500 = ({errorMessage, stacktrace}: SomethingWentWrong500Error) => (
    <BaseRequest
        showBtn
        message={{
            id: config.env !== Env.local ? 'errors.500.message' : 'errors.500.message.with.stacktrace',
            values: config.env !== Env.local ? {} : {
                stacktrace: (errorMessage || stacktrace) ? `${errorMessage} - ${stacktrace}` : ''
            }
        }}
        title={<IntlMessages id="errors.500.title" />}
    />
);

export default SomethingWentWrong500;