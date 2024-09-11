import React from 'react';
import classNames from "classnames";
import A11yButton from '../A11yButton';

type FieldsetComponentProp = {
    wrapperClass?: string,
    titleClass?: string,
    title: React.ReactElement | string,
    rounded?: boolean,
    rightComponent?: React.ReactNode,
    onRightComponentClick?: React.MouseEventHandler<HTMLDivElement>,
    rightComponentClass?: string,
    children: React.ReactNode
}

const FieldsetComponent = ({
                               wrapperClass,
                               titleClass,
                               title,
                               rounded = true,
                               rightComponent,
                               onRightComponentClick,
                               rightComponentClass,
                               children
}: FieldsetComponentProp) => (
    <div
        tabIndex={0}
        className={classNames('custom-fieldset', rounded && 'custom-fieldset-rounded', wrapperClass)}>
        <p className={classNames("p-tag mb-0 custom-fieldset-title", titleClass)}>{title}</p>
        {rightComponent && (
            <A11yButton<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
                elementType="div"
                onClick={onRightComponentClick}
                className={classNames("custom-fieldset-right", rightComponentClass)}>
                {rightComponent}
            </A11yButton>
        )}
        {children}
    </div>
);

export default FieldsetComponent;
