import React from 'react';
import {Controller, ControllerProps} from 'react-hook-form';
import FormText from "../bootstrap/forms/FormText";
import {InputComponentProps} from "./InputComponent";
import Checks, {ChecksProps} from "../bootstrap/forms/Checks";
import {resolveFieldError} from "../../commons/helpers/funcHelper";

export type ChecksInputProps = InputComponentProps & ChecksProps & {
    wrapperClassName?: string;
    checksWrapperClassName?: string;
    controllerProps?: Partial<ControllerProps>;
};

const ChecksInput = ({ name, errors, control, isRequired, wrapperClassName = '', checksWrapperClassName, controllerProps, ...restProps }: ChecksInputProps) => {
    const fieldError = resolveFieldError(errors, name);
    return (
        <Controller
            name={name}
            control={control}
            {...controllerProps}
            render={({ field }) => (
                <div className={wrapperClassName}>
                    <Checks
                        {...restProps}
                        name={name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        checked={field.value}
                        required={isRequired}
                        wrapperClassName={checksWrapperClassName}
                    />
                    {fieldError && fieldError.message && (
                        <FormText
                            id={`${field.name}-text`}
                            style={{ marginLeft: '1rem' }}
                            className='fw-bold text-danger'>
                            {fieldError.message}
                        </FormText>
                    )}
                </div>
            )}
        />
    );
};

export default ChecksInput;