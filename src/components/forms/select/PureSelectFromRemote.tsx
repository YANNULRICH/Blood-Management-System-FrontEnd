import {MessageDescriptor, useIntl} from "react-intl";
import React, { useEffect, useRef, useState } from 'react';

import IntlMessages from "../../IntlMessages";
import Label from "../../bootstrap/forms/Label";
import CustomAsyncComponent from "../../CustomAsyncComponent";
import NotificationManager from "../../notifications/NotificationManager";

export type PureSelectFromRemoteProps<Option> = {
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
    onChange: (val: any) => void,
    watchValue?: string | null;
    shouldWatch?: boolean;
    selectProps?: object;
    name: string,
    label?: React.ReactNode,
    displayRequiredAsterisk?: boolean
    render: (
        options: Option[],
        defaultValue: Option | Option[] | undefined,
        onChange: PureSelectFromRemoteProps<Option>['onChange']
    ) => React.ReactElement
}

const PureSelectFromRemote = <Option extends object>({
                              name,
                              label,
                              render,
                              displayRequiredAsterisk,
                              emptyListText,
                              fetchData,
                              mapItemsToOptions = (item: any) => ({ id: item.id, name: item.name }),
                              defaultValues,
                              defaultValuesMatchFn = (itemFromData: any, itemFromDefaultValues: any) => itemFromData.id === itemFromDefaultValues,
                              onChange,
                              pendingText,
                              watchValue = '',
                              shouldWatch = false,
                              ...restProps
                          }: PureSelectFromRemoteProps<Option>) => {
    const intl = useIntl();
    const defaultValuesRef = useRef<{
        computed: boolean,
        value: any[] | undefined
    }>({
        computed: false,
        value: defaultValues
    });

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
        if (defaultValuesRef.current.computed) {
            return defaultValuesRef.current.value
        }

        if (defaultValues === undefined)
            return undefined

        const values: any[] = []
        defaultValues.forEach((id) => {
            const item = options.find((item: any) => defaultValuesMatchFn(item, id))
            if (item)
                values.push(item)
        });

        onChange(values)
        defaultValuesRef.current.computed = true

        return values;
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
                    onChange(undefined);

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
    }, []);

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

                return render(options, defaultValues, onChange);
            }}
        />
    );
};

export default PureSelectFromRemote;
