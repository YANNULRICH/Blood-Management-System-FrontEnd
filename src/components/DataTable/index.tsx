import classNames from "classnames";
import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';

import {
    Query,
    Action,
    ActionProp,
    DataTableProps,
    DataTableState,
    defaultActions,
    RowDataExtendsType,
    DataTableUrlFilters
} from "./types";
import config from "../../config";
import Button from "../bootstrap/Button";
import Spinner from "../bootstrap/Spinner";
import IntlMessages from "../IntlMessages";
import Tooltips from "../bootstrap/Tooltips";
import Input from "../bootstrap/forms/Input";
import EmptyResult from "../requests/EmptyResult";
import PaginationButtons from "../PaginationButtons";
import TableSkeletonLoader from "../loaders/TableSkeletonLoader";
import {globalDeepSearch} from "../../commons/helpers/funcHelper";
import ErrorRequestComponent from "../errors/ErrorRequestComponent";
import SingleItemTransition from "../transitions/SingleItemTransition";
import {getAllQueryParams, setValuesToQueryParams} from "../../commons/helpers/urlHelper";
import Card, {CardActions, CardBody, CardHeader, CardLabel, CardTitle} from "../bootstrap/Card";


class DataTable<RowData extends RowDataExtendsType> extends Component<DataTableProps<RowData>, DataTableState<RowData>> {
    private queryParams: Partial<DataTableUrlFilters>;

    static defaultProps: Partial<DataTableProps<any>> = {
        options: {
            sort: true,
            search: true,
            pagination: true,
            remotePagination: true,
            localOperation: false,
        }
    }

    constructor(props: DataTableProps<RowData>) {
        super(props);

        this.queryParams = getAllQueryParams<DataTableUrlFilters>();

        this.state = {
            hasReadQueryParams: false,
            query: {
                search: '',
                page: this.queryParams.page || 1,
                pageSize: config.dataTable.defaultPageSize,
                orderBy: undefined,
                orderDirection: 'asc',
            },
            content: {
                fetched: false,
                loading: true,
                error: null,
                data: null,
            },
        }
    }

    componentDidMount() {
        this.loadData().catch(() => null);

        if (this.props.forwardDataTableRef) {
            this.props.forwardDataTableRef({
                getContentData: () => this.state.content.data?.data || null,
                refreshData: this.refreshData,
                deleteDataBy: this.deleteDataBy,
                // @ts-ignore
                deleteDataById: (id) => this.deleteDataBy(id, 'id'),
                updateDataBy: this.updateDataBy,
                // @ts-ignore
                updateDataById: (id, data) => this.updateDataBy(data, id, 'id'),
                updateQueryField: this.updateQueryField
            });
        }
    }

    /**
     * Reload data. Mainly used by parent
     */
    refreshData = () => {
        this.loadData().catch(() => null);
    };

    /**
     * Update state data
     * @param data: {Array<object>} Array of item to save
     */
    setData = (data: RowData[]) => {
        this.setState((prevState) => ({
            content: {
                ...prevState.content,
                data: {
                    data,
                    total: prevState.content.data?.total || 0,
                },
            },
        }));
    };

    /**
     * Try to delete data by a field
     * @param value
     * @param field
     */
    deleteDataBy = (value: unknown, field: keyof RowData) => {
        if (this.state.content.data) {
            this.setData(this.state.content.data.data.filter((item) => item[field] !== value));
        }
    };

    /**
     * Try to update data by a field
     * @param newData {object} the up-to-date data
     * @param value
     * @param field
     */
    updateDataBy = (newData: Partial<RowData>, value: unknown, field: keyof RowData) => {
        if (this.state.content.data) {
            const _newData = [...this.state.content.data.data];
            const item = _newData.find((item) => item[field] === value);
            if (item) {
                Object.assign(item, newData);
                this.setData(_newData);
            }
        }
    }

    loadData = async () => {
        const {query, hasReadQueryParams} = this.state;
        const {disableQueryParams, getData} = this.props;

        this.setState((prevState) => ({content: {...prevState.content, loading: true}}));

        try {
            const _query = {...query};
            _query.page = (_query.page > 0) ? _query.page : 1;

            // We make sure to read query params once, only when page load = first time
            if (!hasReadQueryParams && !disableQueryParams) {
                const page = Number(this.queryParams.page);
                if (Number.isInteger(page) && page > 0) {
                    _query.page = Number(this.queryParams.page);
                }
                // const pageSize = Number(this.queryParams.page_size);
                if (this.queryParams.page_size) {
                    _query.pageSize = this.queryParams.page_size;
                }
                if (this.queryParams.order_column) {
                    // Handle with type
                    // @ts-ignore
                    _query.orderBy = this.queryParams.order_column;
                }
                if (this.queryParams.order_dir) {
                    _query.orderDirection = this.queryParams.order_dir;
                }
                if (this.queryParams.search) {
                    _query.search = this.queryParams.search;
                }

                this.setState({hasReadQueryParams: true});
            }

            let queryComputed: Query<RowData> = {
                page: _query.page,
                pageSize: _query.pageSize || config.dataTable.defaultPageSize,
                orderBy: _query.orderBy || undefined,
                orderDirection: _query.orderDirection
                    ? `${_query.orderDirection}${_query.orderDirection.includes('ending') ? '' : 'ending'}`
                    : undefined,
                // To prevent sending empty string as search terms
                search: _query.search || undefined,
            };
            // Remove undefined values
            Object.keys(queryComputed).forEach((key) => {
                // @ts-ignore
                if (queryComputed[key] === undefined || queryComputed[key] === '') {
                    // @ts-ignore
                    delete queryComputed[key];
                }
            });

            if (!disableQueryParams) {
                // Update both urls while make sure that undefined are not send as value.
                // That way, we could remove a query if value equals empty string
                setValuesToQueryParams({
                    page: queryComputed.page,
                    page_size: queryComputed.pageSize,
                    // We prevent undefined in order to
                    order_column: queryComputed.orderBy || "",
                    // To remove the 'ending' the suffix
                    order_dir: queryComputed.orderDirection || "",
                    search: queryComputed.search || "",
                });
            }

            // Here we make sure that dataArrayOrFn is set and is a function
            if (typeof getData !== "function") {
                throw new Error("getData prop must be an async function. If you have an array, use Promise.resolve(array)");
            }

            const result = await getData(queryComputed);

            const data = {
                data: result.data.results || [],
                total: result.data.count || 0,
            }

            this.setState(prevState => ({
                query: {
                    ...prevState.query,
                    // page: queryComputed.page || prevState.query.page,
                    // pageSize: result.data.perPage || prevState.query.pageSize,
                },
                content: {
                    fetched: true,
                    loading: false,
                    error: null,
                    data,
                }
            }), () => {
                if (this.props.onDataReady)
                    this.props.onDataReady(data)
            });
        } catch (error) {
            console.error(`Error when trying to get table data: ${JSON.stringify({query, error})}`);
            this.setState({
                content: {
                    fetched: true,
                    data: null,
                    loading: false,
                    error: error || new Error('An error occurred while fetching data'),
                },
            });
        }
    };

    /**
     * Function where we apply search and any other filters
     * @return {[]}
     */
    computeData = () => {
        if (this.state.content.data) {
            let data = [...this.state.content.data.data];
            const {search} = this.state.query;
            const {options} = this.props;

            if (options?.search && search) {
                if (options.localOperation) {
                    data = globalDeepSearch(data, search);
                }
            }

            // TODO: HANDLED SORTING

            // Handling pagination
            if (options?.pagination && options.localOperation) {
                const {page, pageSize} = this.state.query;
                data = data.slice((page - 1) * pageSize, page * pageSize);
            }

            return data;
        }

        return [];
    };

    updateQueryField = (field: keyof Query<RowData>, value: unknown) => {
        this.setState((prevState) => ({
            query: {
                ...prevState.query,
                [field]: value,
            },
        }), () => {
            if (!this.props.options?.localOperation) {
                this.loadData().catch(() => null);
            }
        });
    }

    render() {
        const {
            getRowLink,
            actions,
            columns,
            heading,
            options,
            emptyText,
            withoutHeader,
            custumRender,
            bindOnClickToDetails
        } = this.props;
        const {content, query} = this.state;

        // region: TableActions
        let _actions: ActionProp<RowData> = [];
        const _actionsProps = actions || {
            retry: {},
            details: {},
        };

        /*if (_actionsProps.retry)
            _actions.push({
                icon: 'refresh',
                isFreeAction: true,
                onClick: () => this.refreshData(),
                tooltip: globalT("button.refreshData"),
                ..._actionsProps.retry
            });*/

        if (_actionsProps.details) {
            if (typeof _actionsProps.details === "function")
                _actions.push(_actionsProps.details);
            else if (!_actionsProps.details.hidden)
                _actions.push({
                    ...defaultActions?.details,
                    ..._actionsProps.details
                });
        }

        if (_actionsProps.edit) {
            if (typeof _actionsProps.edit === "function")
                _actions.push(_actionsProps.edit);
            else if (!_actionsProps.edit.hidden)
                _actions.push({
                    ...defaultActions?.edit,
                    ..._actionsProps.edit
                });
        }

        if (_actionsProps.delete) {
            if (typeof _actionsProps.delete === "function")
                _actions.push(_actionsProps.delete);
            else if (!_actionsProps.delete.hidden)
                _actions.push({
                    ...defaultActions?.delete,
                    ..._actionsProps.delete
                });
        }

        if (_actionsProps.custom)
            _actions = _actionsProps.custom;

        // Insert a wrapper link simulating native link behaviour on row click
        if (getRowLink) {
            _actions = [..._actions, {
                customRender: (rowData: RowData) => (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/control-has-associated-label
                    <NavLink
                        to={getRowLink(rowData)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            cursor: 'pointer',
                        }}
                    />
                )
            }];
        }

        // endregion

        const data = this.computeData();

        const tableBody = (
            <CardBody className='table-responsive'>
                <table className='table table-modern table-hover' id="table-to-xls">
                    <thead>
                    <tr>
                        {columns.map((column, index) => {
                            if (column.hide) return null;

                            return (
                                <th
                                    key={index}
                                    {...column.wrapperProps}>
                                    {column.title}
                                </th>
                            )
                        })}
                        {_actions.length > 0 && (
                            <th className='text-end'>
                                <IntlMessages id='actions'/>
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1}>
                                <EmptyResult emptyText={emptyText} />
                            </td>
                        </tr>
                    ) : data.map((item, index) => (
                        <tr
                            // @ts-ignore
                            key={item.id || index}
                            className="position-relative">
                            {columns.map((column, index) => {
                                if (column.hide) return null;

                                return (
                                    <td key={index} {...column.wrapperProps}>
                                        {/* @ts-ignore */}
                                        {column.render ? column.render(item) : item[column.field]}
                                    </td>
                                )
                            })}
                            {_actions.length > 0 && (
                                <td>
                                    <p className={classNames('mb-0 center-ver justify-content-end')}>
                                        {_actions.map((act, ind) => {
                                            let action: Action<RowData>;
                                            if (typeof act === "function") {
                                                const _act = act(item);
                                                const _defaultActions = defaultActions && defaultActions[_act.actionType || 'edit'];
                                                action = {
                                                    ..._defaultActions,
                                                    ..._act
                                                }
                                            } else action = act;

                                            if (action.hide)
                                                return null;

                                            if (action.customRender)
                                                return (
                                                    <React.Fragment key={ind}>
                                                        {action.customRender(item)}
                                                    </React.Fragment>
                                                );

                                            const button = (
                                                <Button
                                                    // key={ind}
                                                    tag='a'
                                                    className='border-0'
                                                    style={{ zIndex: 10 }}
                                                    {...action}
                                                    onClick={(e) => action.onClick ? action.onClick(e, item) : null}
                                                />
                                            )

                                            if (action.tooltip) {
                                                return (
                                                    <Tooltips
                                                        key={ind}
                                                        title={action.tooltip}>
                                                        {button}
                                                    </Tooltips>
                                                );
                                            }

                                            return button;
                                        })}
                                    </p>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardBody>
        );

        const paginationButtons = (
            <PaginationButtons
                label='customers'
                currentPage={query.page}
                perPage={query.pageSize}
                totalItems={content.data?.total || content.data?.data.length || 0}
                setCurrentPage={(page) => this.updateQueryField('page', page)}
                setPerPage={(perPage) => this.updateQueryField('pageSize', perPage)}
            />
        );

        return (
            <div className='data-table'>
                {!content.fetched ? (
                    <TableSkeletonLoader />
                ) : (!content.data || content.error) ? (
                    <ErrorRequestComponent error={content.error} loadData={this.loadData}/>
                ) : (
                    <div className='position-relative'>
                        {withoutHeader ? (
                            <>
                                {tableBody}
                                {paginationButtons}
                            </>
                        ) : (
                            <Card stretch='semi'>
                                <CardHeader borderSize={1}>
                                    <CardLabel icon={heading.titleIcon} iconColor={heading.titleIconColor}>
                                        <CardTitle tag='h2'>
                                            {heading.title}
                                        </CardTitle>
                                    </CardLabel>
                                    <CardActions>
                                        <div className='d-flex position-relative'>
                                            <label
                                                htmlFor='searchInput'
                                                className='bg-transparent border-0 cursor-pointer position-absolute start-5 top-50 translate-middle'>
                                                <i className='bx bx-sm bx-pull-right bx-search m-0' />
                                                {/*<Icon icon='Search' size='lg' color='primary' />*/}
                                            </label>
                                            <Input
                                                type='search'
                                                id='searchInput'
                                                autoComplete='off'
                                                value={query.search}
                                                placeholder='Search...'
                                                className='shadow-none border'
                                                style={{ paddingLeft: '30px' }}
                                                onChange={(e: any) => this.updateQueryField('search', e.target.value)}
                                            />
                                        </div>
                                    </CardActions>
                                </CardHeader>
                                { !custumRender ? tableBody : custumRender(this.computeData())}
                                {paginationButtons}
                            </Card>
                        )}
                        {!options?.localOperation && (
                            <SingleItemTransition show={content.loading}>
                                <div className='loader-overlay'>
                                    <Spinner color='primary' size='3rem' />
                                </div>
                            </SingleItemTransition>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default DataTable;
