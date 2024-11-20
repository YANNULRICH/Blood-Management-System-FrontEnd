import classNames from 'classnames';
import React, { useLayoutEffect } from 'react';

import config from "../../config";
import {globalT} from "../../lang";
import {defaultMetadata, Metadata} from "../../commons/data/metadata";

export type PageWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
	metadata?: Metadata,
	children: React.ReactNode
};

const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(({ metadata = defaultMetadata, className, children, ...props }, ref) => {
	useLayoutEffect(() => {
		const _title = metadata.skipTitleIntl ? metadata.title : globalT(metadata.title);
		document.getElementsByTagName('TITLE')[0].textContent = metadata.titleWithoutAppName
			? _title
			: `${_title} | ${config.appName}`;

		// @ts-ignore
		document
			.querySelector('meta[name="description"]')
			.setAttribute('content', globalT(metadata.description || 'metadata.default.desc'));
	});

	return (
		<div ref={ref} className={classNames('page-wrapper', 'container-fluid', className)}>
			{children}
		</div>
	);
});

export default PageWrapper;
