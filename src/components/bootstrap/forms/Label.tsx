import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export type LabelProps = React.HTMLAttributes<HTMLLabelElement>  &{
	htmlFor?: string,
	children?: React.ReactNode,
	isColForLabel? :boolean,
	isHidden?: boolean,
	size?: 'sm' | 'lg',
	title?: string,
	ariaLabelledby?: string,
	ariaLabel?: string,
	isRequired?: boolean
}

const Label = ({
				   htmlFor,
				   className,
				   children,
				   isColForLabel = false,
				   isHidden = false,
				   size,
				   title,
				   ariaLabelledby,
				   ariaLabel,
				   isRequired = false,
				   ...props
			   }: LabelProps) => {
	return (
		<label
			htmlFor={htmlFor}
			className={classNames(
				'form-label',
				{
					'col-form-label': isColForLabel,
					[`col-form-label-${size}`]: isColForLabel && !!size,
					'visually-hidden': isHidden,
				},
				className,
			)}
			title={title}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{children} {isRequired && <span className="text-danger">*</span>}
		</label>
	);
};

export default Label;
