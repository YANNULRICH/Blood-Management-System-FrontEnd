import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export type FormTextProps = React.HTMLAttributes<HTMLDivElement>;

const FormText = ({ id, className, children, ...props }: FormTextProps) => {
	return (
		<div id={id} className={classNames('form-text', className)} {...props}>
			{children}
		</div>
	);
};

export type FormInputTextProps = Partial<FormTextProps> & {
	name: string;
	text: React.ReactNode
}

export const FormInputText = ({ name, className, text, ...props }: FormInputTextProps) => {
	return (
		<FormText
			id={`${name}-text`}
			style={{ marginLeft: '1rem' }}
			className={classNames('fw-bold text-danger', className)}
			{...props}
		>
			{text}
		</FormText>
	)
}

export default FormText;
