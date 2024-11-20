import classNames from 'classnames';
import React, { forwardRef } from 'react';
import {SizeTypeXXL} from "../../components/component.types";

export type PageProps = React.HTMLAttributes<HTMLDivElement> & {
	container?: SizeTypeXXL | 'fluid'
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, className, container = 'xxl', ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={classNames('page', className, {
				[`container${typeof container === 'string' ? `-${container}` : ''}`]: container,
			})}
			{...props}>
			{children}
		</div>
	);
});

export default Page;
