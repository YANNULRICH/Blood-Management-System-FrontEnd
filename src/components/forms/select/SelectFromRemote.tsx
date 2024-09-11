import {MessageDescriptor, useIntl} from "react-intl";
import React, { useEffect, useRef, useState } from 'react';
import {UseFormSetValue} from "react-hook-form/dist/types/form";

import IntlMessages from "../../IntlMessages";
import Label from "../../bootstrap/forms/Label";
import CustomAsyncComponent from "../../CustomAsyncComponent";
import InputComponent, {InputComponentProps} from "../InputComponent";
import NotificationManager from "../../notifications/NotificationManager";
import LANG from "../../../lang/language";
import {useAppSelector} from "../../../store/redux.types";

export type SelectFromRemoteProps = InputComponentProps & {
    pendingText?: MessageDescriptor;
    emptyListText?: MessageDescriptor;
    isReactSelect?: boolean;
    fetchData: Function,
    mapItemsToOptions?: (item: any) => ({ id: string, name: string }),
    defaultValues?: any[],
    /**
     * Function to match item of default values with item from data fetched
     * @param itemFromData
     * @param itemFromDefaultValues
     */
    defaultValuesMatchFn?: (itemFromData: any, itemFromDefaultValues: any) => boolean,
    setValue: UseFormSetValue<any>;
    watchValue?: string | null;
    shouldWatch?: boolean;
    selectProps?: object;
}

const SelectFromRemote = ({
                              errors,
                              control,
                              name,
                              label,
                              displayRequiredAsterisk,
                              emptyListText,
                              fetchData,
                              mapItemsToOptions = (item: any) => ({ id: item.id, name: item.name, en: item.en|| '' }),
                              defaultValues,
                              defaultValuesMatchFn = (itemFromData: any, itemFromDefaultValues: any) => itemFromData.id === itemFromDefaultValues,
                              setValue,
                              pendingText,
                              watchValue = '',
                              shouldWatch = false,
                              ...restProps
                          }: SelectFromRemoteProps) => {
    const intl = useIntl();
    const defaultValuesRef = useRef<{
        computed: boolean,
        value: any[] | undefined
    }>({
        computed: false,
        value: defaultValues
    });

    const { settings } = useAppSelector(({ settings }) => ({
        settings,
    }));

    const [content, setContent] = useState<{
        loading: boolean;
        fetched: boolean;
        data: any[] | null;
        error: any;
    }>({
        loading: watchValue === null ? true : !!watchValue,
        fetched: false,
        data: watchValue ? [] : null,
        error: null,
    });

    const computeDefaultValues = (options: any[]) => {
        if (defaultValuesRef.current.computed)
            return defaultValuesRef.current.value

        if (defaultValues === undefined)
            return undefined

        const values: any[] = []
        defaultValues.forEach((id) => {
            const item = options.find((item: any) => defaultValuesMatchFn(item, id))
            if (item)
                values.push(item)
        });

        // @ts-ignore
        const finalValue = restProps.isMulti ? values : values[0]

        setValue(name, finalValue)
        defaultValuesRef.current.computed = true

        return finalValue;
    }

    const loadData = () => {
        setContent({
            ...content,
            loading: true,
        });

        fetchData(watchValue)
            .then((result: any) => {
                if (!!emptyListText && result.data.length === 0)
                    NotificationManager.warning(intl.formatMessage(emptyListText));

                // Reset the value each time data changed
                if (shouldWatch)
                    setValue(name, undefined);

                setContent({
                    loading: false,
                    fetched: true,
                    data: result.data.results,
                    error: null,
                });
            })
            .catch((error :any) => {
                setContent({
                    error,
                    data: null,
                    fetched: true,
                    loading: false,
                });
            });
    };

    useEffect(() => {
        if (!shouldWatch)
            loadData();
    }, [settings.language]);

    useEffect(() => {
        if (watchValue)
            loadData();
    }, [watchValue]);

    const { data, loading, error, fetched } = content;

    if (!fetched && shouldWatch) {
        return (
            <>
                {/*<div className="min-w-48 pt-20">*/}
                <div className="">
                    <Label isRequired={displayRequiredAsterisk}>
                        {label}
                    </Label>

                    {pendingText && (
                        <p className='mt-2'>
                            <IntlMessages {...pendingText} />
                        </p>
                    )}
                </div>
            </>
        );
    }

    return (
        <CustomAsyncComponent
            data={data}
            error={error}
            loading={loading}
            onRetryClick={loadData}
            component={(dataToRender) => {
                const options = dataToRender.map(mapItemsToOptions)

                const defaultValues = computeDefaultValues(options)

                return (
                    <InputComponent
                        name={name}
                        label={label}
                        errors={errors}
                        control={control}
                        // options={options}
                        options={options.map((c: { id: any; name: any; en: any; }) => ({ id: c.id, name: settings.language === LANG.fr.locale ? c.name : c.en||c.name }))}
                        componentType='select'
                        defaultValue={defaultValues}
                        displayRequiredAsterisk={displayRequiredAsterisk}
                        {...restProps}
                    />
                );
            }}
        />
    );
};

export default SelectFromRemote;
