// @tts-nocheck
/* eslint-disable */

import {HTMLAttributes, ReactElement, ReactNode, ThHTMLAttributes} from "react";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../network/network.types";
import {AxiosResponse} from "axios";
import {ICardLabelProps} from "../bootstrap/Card";
import {IButtonProps} from "../bootstrap/Button";
import {globalT} from "../../lang";
import { EmptyResultProps } from '../requests/EmptyResult';

export type RowDataExtendsType = object;

export type DeleteDataBy<RowData> = (value: unknown, field: keyof RowData) => void;
export type DeleteDataById = (id: string | number | undefined) => void;

export type UpdateDataBy<RowData> = (newData: Partial<RowData>, value: unknown, field: keyof RowData) => void;
export type UpdateDataById<RowData> = (id: string | number | undefined, data: RowData) => void;

/**
 * Reference to the current component to access methods to perform various operations
 */
export type DataTableRef<RowData extends RowDataExtendsType> = {
    getContentData: () => RowData[] | null;
    refreshData: () => void;
    deleteDataBy: DeleteDataBy<RowData>;
    deleteDataById: DeleteDataById;
    updateDataBy: UpdateDataBy<RowData>;
    updateDataById: UpdateDataById<RowData>;
    updateQueryField: (field: keyof Query<RowData>, value: unknown) => void
    // tableRef: RefObject<typeof OriginalMaterialTable>;
}

/**
 * New query param used by getRemoteData | Data param
 */
export interface Query<RowData extends RowDataExtendsType> {
    page: number;
    pageSize: number;
    orderBy: string | undefined;
    orderDirection: string | undefined;
    search: string | undefined;
}

export interface QueryComputed<RowData extends RowDataExtendsType> extends Query<RowData> {
    pageComputed: number;
    pageSizeComputed: number;
    orderByComputed: string | undefined;
    orderDirectionComputed: string | undefined;
    searchComputed: string | undefined;
}

export type DataTableState<RowData extends RowDataExtendsType> = {
    hasReadQueryParams: boolean;
    query: Query<RowData>;
    content: {
        fetched: boolean,
        loading: boolean,
        error: any,
        data: null | {
            data: RowData[];
            total: number;
        },
    },
}

/**
 * Use this to type function given as data props
 */
export type DataQueryResultFunction<RowData extends RowDataExtendsType> = (query: Query<RowData>) => Promise<AxiosResponse<CSUClientApiResponse<RowData[]>, AxiosRequestConfigExtended>>;

export interface Column<RowData extends RowDataExtendsType> {
    field: keyof RowData;
    title: ReactNode;
    sortable?: boolean;
    searchable?: boolean;
    hide?: boolean,
    render?: (rowData: RowData) => ReactNode;
    wrapperProps?: ThHTMLAttributes<any>;
}

export interface Options<RowData extends RowDataExtendsType> {
    search?: boolean;
    remoteSearch?: boolean;
    sort?: boolean;
    pagination?: boolean;
    remotePagination?: boolean;
    localOperation?: boolean;
}

export interface Action<RowData extends RowDataExtendsType> extends Omit<IButtonProps, 'onClick'> {
    hide?: boolean;
    actionType?: 'retry' | 'delete' | 'edit' | 'details' | 'custom';
    disabled?: boolean;
    position?: "auto" | "toolbar" | "toolbarOnSelect" | "row";
    tooltip?: string;
    customRender?: (rowData: RowData) => ReactNode;
    onClick?: (event: any, data: RowData | RowData[]) => void;
}

export type ActionProp<RowData extends RowDataExtendsType> = (Partial<Action<RowData>> | ((rowData: RowData) => Partial<Action<RowData>>))[];

export type OnDataReadyType<RowData extends RowDataExtendsType> = {
    data: RowData[],
    total: number
}

export type DataTableProps<RowData extends RowDataExtendsType> = {
    withoutHeader?: boolean;
    /**
     * Function called when data have been fetched
     * @param data
     */
    onDataReady?: (content: OnDataReadyType<RowData>) => void;
    hideLoader?: boolean;
    // Get data whether from remote or local
    getData: DataQueryResultFunction<RowData>;
    // Whether or not to link the click on a row and the onClick on details button
    getRowLink?: (rowData: RowData) => string;
    // For this feature to properly work, you need to set getRowLink
    bindOnClickToDetails?: boolean;
    options?: Partial<Options<RowData>>;
    columns: Partial<Column<RowData>>[];
    emptyText: EmptyResultProps['emptyText'];
    onRowClick?: (rowData: RowData) => void;
    containerClassName?: string;
    custumRender?: (data: any) => ReactElement
    /**
     * Disable the url modifying feature. It's useful for page that contains more than 1 table
     * By default the feature is enabled
     */
    disableQueryParams?: boolean;
    forwardDataTableRef?: (dataTableRef: DataTableRef<RowData>) => void;
    heading: {
        title: ReactNode;
        titleIcon?: ICardLabelProps['icon'];
        titleIconColor?: ICardLabelProps['iconColor'];
    }
    actions?: {
        retry?: (Partial<Action<RowData>> | ((rowData: RowData) => Partial<Action<RowData>>));
        edit?: (Partial<Action<RowData>> | ((rowData: RowData) => Partial<Action<RowData>>));
        details?: (Partial<Action<RowData>> | ((rowData: RowData) => Partial<Action<RowData>>));
        delete?: (Partial<Action<RowData>> | ((rowData: RowData) => Partial<Action<RowData>>));
        custom?: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[];
    };
}

/**
 * Filters available for DataTable. These will be present in page url as query parameters
 */
export interface DataTableUrlFilters {
    /**
     * Define the number of items to display per page.
     * Value range: Number managed by a restricted list.
     */
    page_size: number;

    /**
     * Define current page
     * Start from 1
     */
    page: number;

    /**
     * String representing the column to order by
     */
    order_column: string;

    /**
     * Direction of ordering
     */
    order_dir: 'asc' | 'desc';

    /**
     * Search terms
     */
    search: string;
}


export const defaultActions: DataTableProps<any>['actions'] = {
    details: {
        actionType: 'details',
        isOutline: true,
        icon: 'RemoveRedEye',
        color: 'warning',
        tooltip: globalT("button.showDetails"),
    },
    edit: {
        actionType: 'edit',
        isOutline: true,
        icon: 'Edit',
        size: 'sm',
        isLight: true,
        color: 'primary',
        className: '',
        children: globalT("button.edit"),
    },
    delete: {
        actionType: 'delete',
        isOutline: true,
        icon: 'Delete',
        color: 'danger',
        tooltip: globalT("button.delete"),
    }
}
