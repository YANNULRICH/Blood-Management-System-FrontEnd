import React, {ReactElement} from 'react';
import {FormattedMessage, MessageDescriptor} from 'react-intl';

export type FormattedMessageProps = MessageDescriptor &
	{
		// eslint-disable-next-line @typescript-eslint/ban-types
		values?: object,
		tagName?: string,
		children?: (chunks: ReactElement) => ReactElement,
	};

// @ts-ignore
const InjectMessage = (props: FormattedMessageProps) => <FormattedMessage {...props} />;

export default InjectMessage;

// @ts-ignore
// export default injectIntl(InjectMessage, {
//     withRef: false,
// });
