import React from 'react';

import BaseRequest from "./BaseRequest";
import IntlMessages from "../IntlMessages";

const ConnexionExpired401 = () => (
    <BaseRequest
        showBtn
        message={{
            id: 'errors.401.message'
        }}
        title={<IntlMessages id="errors.401.title" />}
    />
);

export default ConnexionExpired401;