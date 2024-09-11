import React, {Children, cloneElement, DOMAttributes, forwardRef} from 'react';
import classNames from 'classnames';
import Validation from './Validation';
import {LabelProps} from "./Label";
import useDarkMode from "../../../hooks/useDarkMode";

export type ChecksGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
	isInline?: boolean,
	isFormCheckInput?: boolean,
	isTouched?: boolean,
	isValid?: boolean,
	invalidFeedback?: string,
	validFeedback?: string,
	isTooltipFeedback?: string,
	label?: React.ReactNode,
	checkWrapperProps?: React.HTMLAttributes<HTMLDivElement>,
	children: React.ReactNode[],
}

export const ChecksGroup = forwardRef<HTMLDivElement, ChecksGroupProps>(
	(
		{
			id,
			className,
			children,
			label,
			isInline = false,
			isValid = false,
			isTouched = false,
			invalidFeedback = undefined,
			validFeedback = undefined,
			isTooltipFeedback = false,
			checkWrapperProps = {},
			...props
		},
		ref,
	) => {
		return (
			<>
				{/* @ts-ignore */}
				<div
					ref={ref}
					id={id}
					className={classNames(
						{
							'is-invalid': !isValid && isTouched && invalidFeedback,
							'is-valid': !isValid && isTouched && !invalidFeedback,
						},
						className,
					)}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}>
					{label && (
						<label
							className={classNames('form-check-label me-2')}
						>
							{label}
						</label>
					)}
					<div {...checkWrapperProps} className={classNames(checkWrapperProps?.className, {
						'd-inline-block': isInline,
					})}>
						{Children.map(children, (child, index) =>
							// @ts-ignore
							cloneElement(child, {
								key: index,
								// @ts-ignore
								isInline: child.props.isInline || isInline,
								isValid,
								isTouched,
								invalidFeedback,
								validFeedback,
								isTooltipFeedback,
								isValidMessage: false,
							}),
						)}
					</div>
				</div>
				<Validation
					isTouched={isTouched}
					invalidFeedback={invalidFeedback}
					validFeedback={validFeedback}
					// @ts-ignore
					isTooltip={isTooltipFeedback}
				/>
			</>
		);
	},
);

export type ChecksProps = Partial<HTMLInputElement & DOMAttributes<HTMLInputElement>> & {
	type?: 'checkbox' | 'radio' | 'switch',
	isInline?: boolean,
	isFormCheckInput?: boolean,
	isTouched?: boolean,
	isValid?: boolean,
	invalidFeedback?: string,
	validFeedback?: string,
	label?: React.ReactNode,
	isValidMessage?: boolean,
	isTooltipFeedback?: boolean,
	labelProps?: LabelProps,
	wrapperClassName?: string
}

const Checks = forwardRef<HTMLInputElement, ChecksProps>(
	(
		{
			id,
			className,
			name,
			type = 'checkbox',
			label,
			value,
			checked,
			disabled,
			isInline = false,
			isFormCheckInput = false,
			isValid = false,
			isTouched = false,
			invalidFeedback ,
			validFeedback,
			isValidMessage = true,
			isTooltipFeedback = false,
			onBlur,
			onChange,
			onFocus,
			onInput,
			onInvalid,
			onSelect,
			ariaLabel,
			labelProps = {},
			wrapperClassName,
			...props
		},
		ref,
	) => {
		const darkStatus = useDarkMode()
		const _inner = (
			// @ts-ignore
			<input
				ref={ref}
				className={classNames(
					'form-check-input',
					{
						'border border-light': darkStatus.darkModeStatus,
						'border border-dark': !darkStatus.darkModeStatus,
						'mt-0': isFormCheckInput,
						'is-invalid': !isValid && isTouched && invalidFeedback,
						'is-valid': !isValid && isTouched && !invalidFeedback,
					},
					className,
				)}
				name={name === null ? id : name}
				type={type === 'radio' ? 'radio' : 'checkbox'}
				id={id}
				value={value}
				// @ts-ignore
				checked={type === 'radio' ? checked === value : checked}
				disabled={disabled}
				onBlur={onBlur}
				onChange={onChange}
				onFocus={onFocus}
				onInput={onInput}
				onInvalid={onInvalid}
				onSelect={onSelect}
				aria-label={ariaLabel}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		);

		if (isFormCheckInput) {
			return _inner;
		}

		return (
			<div
				className={classNames(wrapperClassName, 'form-check', {
					'form-switch': type === 'switch',
					'form-check-inline': isInline,
				})}>
				{_inner}
				{label && (
					<label
						{...labelProps}
						htmlFor={id || name}
						className={classNames('form-check-label', labelProps.className)}
					>
						{label}
					</label>
				)}
				{isValidMessage && (
					<Validation
						isTouched={isTouched}
						invalidFeedback={invalidFeedback}
						validFeedback={validFeedback}
						isTooltip={isTooltipFeedback}
					/>
				)}
			</div>
		);
	},
);

export default Checks;
