import React, { useRef, useState } from 'react';
import makeAnimated from "react-select/animated";
import { AsyncPaginate, AsyncPaginateProps } from "react-select-async-paginate";

import {
    themeProps,
    BaseAsyncPaginate,
    asyncSelectStyles,
    SELECT_ASYNC_PAGINATE_PAGE_SIZE,
} from './ExtendedSelect';
import FetchFailedComponent from '../../requests/FetchFailedComponent';

const animatedComponents = makeAnimated();

export type Additional = {
    page: number;
    pageSize: number;
}

export type Options = {
    name: string,
    id: string,
    [key: string]: any,
};

type SelectAsyncPaginateBaseType = Omit<AsyncPaginateProps<any, any, any, any>, "loadOptions" | "additional">;

export type SelectAsyncPaginateProps<DataOption> = SelectAsyncPaginateBaseType & {
    /**
     * Optional param to initialize certain fields internally like page and pageSize
     */
    defaultAdditional?: Additional,

    /**
     * Function to execute in order to get options of the select
     * @param data
     */
    mapDataToOptions?: (data: Array<any>) => Array<DataOption>,

    /**
     * The information about the request to execute
     */
    fetchData: (page: number, pageSize: number, search: string | undefined) => Promise<any>,
    /**
     * Function to use to init default data. It will be only called the first time data get loaded
     * @param options
     */
    onFirstDataReady?: (options: DataOption[]) => void;
}

/**
 * Display a select option list with remote data loaded as user scrolls down
 * @param data
 * @param restProps
 * @constructor
 */

function SelectAsyncPaginate<DataOption = Options>({
       fetchData,
       defaultAdditional = { page: 1, pageSize: 100 },
        // @ts-ignore
       mapDataToOptions = (data: Array<any>) => data.map((i: any) => ({name: i.name, id: i.id})),
       onFirstDataReady,
       ...restProps
    }: SelectAsyncPaginateProps<DataOption>) {
    const [error, setError] = useState<any>(undefined);
    const firedOnFirstDataReady = useRef(false);

    // eslint-disable-next-line
    const loadPageOptions =  async (search: string, prevOptions: any, additional: Additional) => {
        try {
            const result = await fetchData(additional.page, additional.pageSize, search || undefined)

            // Everything went fine so reset error
            setError(undefined);

            const data = result.data.results;
            const totalCount = result.data.count;
            const options = mapDataToOptions(data);

            // We can load more if either there's no data or the total available data is greater than
            //   the page times the pageSize.
            // Since page exceptionally can be 0, then we remove that case with || 1 so that the multiplication could be easily done
            const hasMore = totalCount > (additional.page || 1) * additional.pageSize || data.length > 0;

            // Notify parent about for default values handling
            if (onFirstDataReady && firedOnFirstDataReady.current === false) {
                onFirstDataReady(options)
                firedOnFirstDataReady.current = true
            }

            return {
                options,
                hasMore,
                additional: {
                    page: additional.page + 1,
                }
            }
        } catch (e) {
            setError(e || new Error("An error occurred while fetching data"));
        }
    }

    return (
        <div>
            {error ? (
                <FetchFailedComponent onRetryClick={() => loadPageOptions('', undefined, defaultAdditional)} />
            ) : (
                <AsyncPaginate
                    isClearable
                    debounceTimeout={500}
                    additional={defaultAdditional}
                    components={animatedComponents}
                    theme={themeProps}
                    menuPortalTarget={document.body}
                    styles={asyncSelectStyles}
                    // @ts-ignore
                    loadOptions={loadPageOptions}
                    {...restProps}
                />
            )}
        </div>
    );
}

export default SelectAsyncPaginate;


type SelectAsyncPaginateWithLocalDataProps = SelectAsyncPaginateBaseType & {
    data: Array<any>
};

/**
 * Display a select option list with local data loaded as user scrolls down.
 *
 * Tips: If you changed the whole list or you want to refresh the list then, you may use prop cacheUniqs={[deps]}
 *       E.G: given a variable refreshData, then you'd have this as prop cacheUniqs={[refreshData]}
 * @param data
 * @param restProps
 * @constructor
 */
export const SelectAsyncPaginateWithLocalData = ({data, ...restProps}: SelectAsyncPaginateWithLocalDataProps) => {
    const loadOptions = async (search: string, prevOptions: SelectAsyncPaginateWithLocalDataProps['data']) => {
        if (data.length === 0)
            return {
                options: [],
                hasMore: false
            };

        // Filter data with searched value if one present
        let filteredOptions;
        if (!search) {
            filteredOptions = data;
        } else {
            const searchLower = search.toLowerCase();

            filteredOptions = data.filter(({ label }) =>
                label.toLowerCase().includes(searchLower)
            );
        }

        const hasMore = filteredOptions.length > prevOptions.length + SELECT_ASYNC_PAGINATE_PAGE_SIZE;
        // Paginate here
        const slicedOptions = filteredOptions.slice(
            prevOptions.length,
            prevOptions.length + SELECT_ASYNC_PAGINATE_PAGE_SIZE
        );

        // Return pagination control
        return {
            options: slicedOptions,
            hasMore
        };
    };
    
    return (
        <BaseAsyncPaginate
            components={animatedComponents}
            theme={themeProps}
            menuPortalTarget={document.body}
            styles={asyncSelectStyles}
            // @ts-ignore
            loadOptions={loadOptions}
            {...restProps}
        />
    );
}
