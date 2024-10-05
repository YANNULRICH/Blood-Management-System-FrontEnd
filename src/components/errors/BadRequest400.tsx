import React from 'react';

import BaseRequest from "./BaseRequest";
import IntlMessages from "../IntlMessages";

const BadRequest400 = () => (
    <BaseRequest
        showBtn
        message={{
            id: 'errors.400.message'
        }}
        title={<IntlMessages id="errors.400.title" />}
    />
);

export default BadRequest400;