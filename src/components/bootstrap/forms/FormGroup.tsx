import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TagWrapper, {TagWrapperProps} from '../../TagWrapper';
import Label from './Label';
import FormText from './FormText';

export type FormGroupProps = Omit<TagWrapperProps, 'tag'> & {
	tag: 'div' | 'section',
	isFloating?: boolean,
	labelClassName?: string,
	childWrapperClassName?: string,
	label?: React.ReactNode,
	id?: string,
	size?: 'sm' | 'lg',
	isColForLabel?: boolean,
	isHiddenLabel?: boolean,
	formText?: React.ReactNode,
	isRequired?: boolean,
	displayRequiredAsterisk?: boolean,
	children: React.ReactElement,
}

const FormGroup = ({
					   children,
					   tag = 'div',
					   className,
					   labelClassName,
					   childWrapperClassName,
					   label,
					   id,
					   isFloating = false,
					   size,
					   isRequired = true,
					   displayRequiredAsterisk = true,
					   isColForLabel = false,
					   isHiddenLabel = false,
					   formText,
					   ...props
				   }: FormGroupProps) => {
	const _label = (
		<Label
			className={labelClassName}
			htmlFor={id}
			isHidden={isHiddenLabel}
			isColForLabel={isColForLabel}
			isRequired={displayRequiredAsterisk && isRequired}
			size={size}>
			{label}
		</Label>
	);

	const _children = id
		? cloneElement(children, {
			id,
			size: 1,
			placeholder: isFloating ? label : children.props.placeholder,
			'aria-describedby': formText ? `${id}-text` : null,
		})
		: children;

	const _formText = formText && <FormText id={`${id}-text`}>{formText}</FormText>;
	return (
		<TagWrapper
			tag={tag}
			className={classNames({ 'form-floating': isFloating, row: isColForLabel }, className)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{label && !isFloating && _label}

			{childWrapperClassName ? (
				<div className={childWrapperClassName}>
					{_children}
					{_formText}
				</div>
			) : (
				_children
			)}

			{label && isFloating && _label}

			{!childWrapperClassName && _formText}
		</TagWrapper>
	);
};

export default FormGroup;
