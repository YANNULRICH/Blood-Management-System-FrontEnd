import React from 'react';

import BaseRequest from "./BaseRequest";
import IntlMessages from "../IntlMessages";

const Forbidden403 = () => (
    <BaseRequest
        showBtn
        message={{
            id: 'errors.403.message'
        }}
        title={<IntlMessages id="errors.403.title" />}
    />
);

export default Forbidden403;
