import React, {useEffect} from "react";
import { Controller } from 'react-hook-form';

import {globalT} from "../../lang";
import Input from "../bootstrap/forms/Input";
import Label from "../bootstrap/forms/Label";
import FormText from "../bootstrap/forms/FormText";
import FormGroup from "../bootstrap/forms/FormGroup";
import {FieldErrors} from "react-hook-form/dist/types/errors";
import {resolveFieldError} from "../../commons/helpers/funcHelper";
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import {Control, UseFormSetValue} from "react-hook-form/dist/types/form";
import {UseControllerProps} from "react-hook-form/dist/types/controller";
import {BaseProps, CreatableSelect, Select} from "./select/ExtendedSelect";
import Textarea from "../bootstrap/forms/Textarea";
import useDarkMode from "../../hooks/useDarkMode";
import classNames from "classnames";

export type FieldValues = Record<any, any>;
export type TContext = any;

export type InputComponentProps = (React.HTMLAttributes<HTMLInputElement> | BaseProps<any, boolean, any> ) & {
    // control and errors are handled by react-hook-form
    control: Control<any, TContext>,
    errors: FieldErrors<any>,
    label?: React.ReactNode,
    helperLabel?: React.ReactNode,
    name: string,
    disabled?: boolean,
    noPlaceholder?: boolean,
    displayRequiredAsterisk?: boolean,
    type?: HTMLInputElement['type'],
    options?: Array<any>,
    isRequired?: boolean,
    isDisabled?: boolean,
    setValue?: UseFormSetValue<any>;
    autoSelectTheFirst?: boolean,
    defaultDisabledIfOnlyOneItem?: boolean,
    controllerProps?: object,
    wrapperProps?: object,
    componentType?: 'input' | 'select' | 'select-create' | 'date' | 'custom' | 'textarea',
    // Override validate to fix typescript error on validate function.
    // Example: (val) => condition && (<IntlMessages id='xxx' />)
    otherValidators?: Omit<UseControllerProps['rules'], 'validate'> & {
        validate?: RegisterOptions['validate'] | ((val: string | undefined) => true | JSX.Element)
    },
    customInputRender?: (props: any) => React.ReactNode,
    children?: React.ReactNode
}

const InputComponent = ({
    control,
    errors,
    label,
    helperLabel,
    name,
    noPlaceholder = true,
    isRequired = true,
    displayRequiredAsterisk = false,
    componentType = 'input',
    setValue,
    isDisabled = undefined,
    autoSelectTheFirst = false,
    defaultDisabledIfOnlyOneItem = false,
    options,
    customInputRender,
    otherValidators = {},
    controllerProps = {},
    wrapperProps = {},
    ...restProps
}: InputComponentProps) => {
    const fieldError = resolveFieldError(errors, name);
    const { darkModeStatus } = useDarkMode();
    useEffect(() => {
        if (autoSelectTheFirst && setValue && options && options.length > 0) {
            setValue(name, options[0]);
        }
    }, []);

    return (
        <>
            {componentType === 'custom' ? (
                // @ts-ignore
                <Controller name={name} control={control} {...restProps} />
            ) : (
                <Controller
                    name={name}
                    control={control}
                    // @ts-ignore
                    rules={{
                        required: {
                            value: isRequired,
                            message: globalT('form.errors.required')
                        },
                        ...otherValidators
                    }}
                    {...controllerProps}
                    render={({ field }) => {
                        if (componentType === 'select' || componentType === 'select-create') {
                            const Component = componentType === 'select' ? Select : CreatableSelect;
                            return (
                                <>
                                    {label && (
                                        <Label
                                            isRequired={displayRequiredAsterisk && isRequired}
                                            className={classNames({'text-black':darkModeStatus})}
                                        >
                                            {label}
                                        </Label>
                                    )}
                                    <Component
                                        {...field}
                                        options={options}
                                        isDisabled={isDisabled || (defaultDisabledIfOnlyOneItem && options && options.length === 1)}
                                        {...restProps}
                                    />
                                    {fieldError && fieldError.message && (
                                        <FormText
                                            id={`${field.name}-text`}
                                            style={{ marginLeft: '1rem' }}
                                            className='fw-bold text-danger'>
                                            {fieldError.message}
                                        </FormText>
                                    )}
                                </>
                            );
                        }

                        if (componentType === 'textarea') {
                            return (
                                <>
                                    {label && (
                                        <Label
                                            className={classNames({'text-light':darkModeStatus})}
                                            isRequired={displayRequiredAsterisk && isRequired}>
                                            {label}
                                        </Label>
                                    )}

                                    <Textarea
                                        {...field}
                                        rows={5}
                                    />


                                    {fieldError && fieldError.message && (
                                        <FormText
                                            id={`${field.name}-text`}
                                            style={{ marginLeft: '1rem' }}
                                            className='fw-bold text-danger'>
                                            {fieldError.message}
                                        </FormText>
                                    )}
                                </>
                            )
                        }

                        return (
                            // @ts-ignore
                            <FormGroup
                                tag='div'  // 'div' || 'section'
                                id={field.name}
                                label={helperLabel || label}
                                labelClassName={classNames({'text-light':darkModeStatus})}
                                isRequired={isRequired}
                                isFloating={!!helperLabel}
                                displayRequiredAsterisk={displayRequiredAsterisk}
                                {...wrapperProps}
                            >
                                <>
                                    {customInputRender
                                        ? customInputRender({
                                            component: componentType,
                                            field,
                                            required: isRequired,
                                            // @ts-ignore
                                            placeholder: noPlaceholder ? undefined : globalT((helperLabel || label).props.id),
                                            ...restProps
                                        })
                                        : (
                                        <Input
                                            {...field}
                                            // @ts-ignore Here we infer the props type from the input component
                                            placeholder={noPlaceholder ? undefined : globalT((helperLabel || label).props.id)}
                                            // @ts-ignore
                                            required={isRequired}
                                            // @ts-ignore
                                            component={componentType}
                                            {...restProps}
                                        />
                                    )}

                                    {fieldError && fieldError.message && (
                                        <FormText
                                            id={`${field.name}-text`}
                                            style={{ marginLeft: '1rem' }}
                                            className='fw-bold text-danger'>
                                            {fieldError.message}
                                        </FormText>
                                    )}
                                </>
                            </FormGroup>
                        );
                    }}
                />
            )}
        </>
    );
};

export default InputComponent;
