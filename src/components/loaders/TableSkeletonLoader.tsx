import React from 'react';
import CircularLoader from './CircularLoader';

export type TableSkeletonLoaderProps = {
    colCount?: number;
    rowCount?: number;
}

const TableSkeletonLoader = ({ colCount = 4, rowCount = 5 }: TableSkeletonLoaderProps) => {
    return (
        <CircularLoader />
    );
};

export default TableSkeletonLoader;
