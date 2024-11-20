import React, {ReactHTML} from 'react';
import {keyDownA11y} from "../commons/helpers/funcHelper";

export type A11yButtonProps<E extends React.HTMLAttributes<T>, T extends HTMLElement> = React.ClassAttributes<T> & E & {
    elementType: keyof ReactHTML;
};

/*
* This is a useful component to allow accessibility on events
*   it means that click events should have key events bound.
* Just wrap this component with the normal component/HTML you want
*   to use and pass your onClick function and precise the element type
*
*
* Solution: https://stackoverflow.com/questions/42998927/accessibility-react-ensure-click-events-have-key-events
* */
export default function A11yButton<E extends React.HTMLAttributes<T>, T extends HTMLElement>({
   elementType,
   // @ts-ignore
   onClick,
   ...props
}: A11yButtonProps<E, T>) {
    return React.createElement(elementType, {
        ...props,
        onClick,
        onKeyDown: keyDownA11y(onClick),
        role: 'button',
        // Add other props that might be necessary, like "tabIndex: 0,"
    });
}