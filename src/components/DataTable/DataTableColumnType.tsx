import React from 'react';
import A11yButton from "../A11yButton";

export type DataTableColumnProps = {
    orderColumn: string,
    /**
     * Whether ordering feature is enabled
     */
    ordering?: boolean,
    /**
     * Check if we are currently ordering with this column
     */
    isOrderActive: boolean,
    orderDirection: 'asc' | 'desc',
    children: React.ReactNode,
    onOrder?: (orderColumn: string, orderDirection: 'asc' | 'desc') => void;
}

const DataTableColumnType = ({ ordering, orderColumn, onOrder, isOrderActive, orderDirection, children  }: DataTableColumnProps) => {
    return (
        <>
            {!ordering ? children : (
                <A11yButton<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
                    elementType='span'
                    onClick={() => onOrder && onOrder( // the cycle is asc -> desc -> reset then loop
                        orderDirection === 'desc' ? 'default' : orderColumn,
                        isOrderActive ? orderDirection === 'asc' ? 'desc' : 'asc' : 'asc'
                    )}
                    className={`cursor-pointer text-underline-hover white-space-nowrap ${isOrderActive && 'text-primary'}`}>
                    {children}
                    <i className={`bx bx-sm vertical-align-middle bx-sort${isOrderActive ? (orderDirection === 'asc' ? '-up' : '-down') : ''}`} />
                </A11yButton>
            )}
        </>
    );
};

export default DataTableColumnType;