import React from 'react';
import makeAnimated from "react-select/animated";
import BaseCreatableSelect from 'react-select/creatable';
import {AsyncPaginate, AsyncPaginateProps} from "react-select-async-paginate";
import BaseSelect, {Props, ThemeConfig, StylesConfig, GroupBase} from 'react-select';

import {globalT} from "../../../lang";
import IntlMessages from "../../IntlMessages";
import useDarkMode from "../../../hooks/useDarkMode";
import COLORS from "../../../commons/data/enumColors";

const animatedComponents = makeAnimated();
// const { darkModeStatus } = useDarkMode();

/**
 * Overriding theme
 * @param _theme
 */
export const themeProps: ThemeConfig = (_theme) => ({
    ..._theme,
    colors: {
        ..._theme.colors,
        // primary: COLORS.SECONDARY.name,
        // primary: '#b6aee9',
    },
});

/**
 * Overriding styles
 */
export const selectStyles: StylesConfig = {
    /**
     * Fix issue with modal which cut off the menu content
     * Used in conjunction with menuPortalTarget={document.body}
     * @param base
     */
    menuPortal: base => ({ ...base, zIndex: 9999 })
}

export interface FilterOptionOption<Option> {
    readonly label: string;
    readonly value: string;
    readonly data: Option;
}

export type ExtendedSelectProps = {
    /**
     * True assumes that options will be Array<{label: string, value: string}>
     * default to true
     */
    defaultFilterOption?: boolean;
}

export type BaseProps<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
> = (Props<Option, IsMulti, Group>) & ExtendedSelectProps;


/**
 * Return true to display a line of data and false to hide it.
 * @param candidate
 * @param input
 */
const filterOptionFunc = (candidate: FilterOptionOption<any>, input: string) => {
    if (input) {
        return candidate.label.toLowerCase().includes(input.toLowerCase());
    }
    return true;
};

/**
 * Animated Select component which also handle default filter option
 * @param defaultFilterOption
 * @param filterOption
 * @param restProps
 * @constructor
 */
export const AnimatedSelect = <
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
    >({defaultFilterOption = true, filterOption, ...restProps }: Props<Option, IsMulti, Group> & ExtendedSelectProps) => (
    <BaseSelect
        isClearable
        // @ts-ignore
        styles={selectStyles}
        theme={themeProps}
        menuPortalTarget={document.body}
        // @ts-ignore
        components={animatedComponents}
        placeholder={globalT('form.type.select.placeholder')}
        noOptionsMessage={() => globalT('form.type.select.noOptions')}
        // @ts-ignore
        filterOption={defaultFilterOption ? filterOptionFunc : filterOption}
        {...restProps}
    />
);

/**
 * Create a base component with default props and style
 * @param defaultFilterOption
 * @param filterOption
 * @param restProps
 * @constructor
 */
export const CreatableSelect = <
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
    >({defaultFilterOption = true, filterOption, ...restProps }: Props<Option, IsMulti, Group> & ExtendedSelectProps) => (
    <BaseCreatableSelect
        // @ts-ignore
        styles={selectStyles}
        theme={themeProps}
        menuPortalTarget={document.body}
        placeholder={globalT('form.type.select.placeholder')}
        noOptionsMessage={() => globalT('form.type.select.noOptions')}
        filterOption={defaultFilterOption ? filterOptionFunc : filterOption}
        {...restProps}
    />
);


/**
 * Overriding default react-select
 * @param defaultFilterOption
 * @param filterOption
 * @param restProps
 * @constructor
 */
export const Select = React.forwardRef<React.ReactElement, BaseProps<any, boolean, any>>(({ defaultFilterOption = true, filterOption, ...restProps}, ref) => (
    <BaseSelect
        // @ts-ignore
        ref={ref}
        className='bg-dark text-dark'
        styles={selectStyles}
        theme={themeProps}
        // menuPortalTarget={document.body}
        placeholder={<IntlMessages id='form.type.select.placeholder'/>}
        noOptionsMessage={() => <IntlMessages id='form.type.select.noOptions'/>}
        filterOption={defaultFilterOption ? filterOptionFunc : filterOption}
        {...restProps}
    />
));


export const SELECT_ASYNC_PAGINATE_PAGE_SIZE = 20;

export const asyncSelectStyles: StylesConfig = {
    /**
     * Fix issue with modal which cut off the menu content
     * Used in conjunction with menuPortalTarget={document.body}
     * @param base
     */
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999
    }),
    menuList: (provided: any) => ({
        ...provided,
        maxHeight: '200px',
        zIndex: 9999
    }),
}

type BaseAsyncPaginateType<
    Option,
    Group extends GroupBase<Option> = GroupBase<Option>,
    // @ts-ignore
    Additional,
    IsMulti extends boolean = false,
    > = AsyncPaginateProps<Option, Group, Additional, IsMulti>;

export type BaseAsyncPaginateProps = BaseAsyncPaginateType<any, any, any, any>;

/**
 * Select list with asynchronous pagination either with local data or remote one
 * @param props
 * @constructor
 */
export const BaseAsyncPaginate = (props: BaseAsyncPaginateProps) => (
    <AsyncPaginate
        isClearable
        theme={themeProps}
        styles={asyncSelectStyles}
        // The following function has been taken from react-select-async-paginate in the file defaultShouldLoadMore.ts
        shouldLoadMore={(scrollHeight, clientHeight, scrollTop) => {
            const bottomBorder = scrollHeight - clientHeight - SELECT_ASYNC_PAGINATE_PAGE_SIZE;

            return bottomBorder < scrollTop;
        }}
        {...props}
    />
)
