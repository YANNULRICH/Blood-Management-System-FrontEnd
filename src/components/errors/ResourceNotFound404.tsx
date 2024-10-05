import React from 'react';

import BaseRequest from "./BaseRequest";
import IntlMessages from "../IntlMessages";

const ResourceNotFound404 = () => (
	<BaseRequest
		showBtn
		message={{
			id: 'errors.404.message'
		}}
		title={<IntlMessages id="errors.404.title" />}
	/>
);

export default ResourceNotFound404;
