import React from 'react';
import IntlMessages from "../IntlMessages";
import DialogComponent, {DialogComponentProps} from "./DialogComponent";
import Button from "../bootstrap/Button";

export type ConfirmDialogProps = Omit<DialogComponentProps, 'children' | 'title' | 'onClose'> & {
    onCancel: () => void,
    onConfirm: () => void,
    title?: React.ReactNode,
    message: React.ReactNode,
}

const ConfirmDialog = ({ onConfirm, onCancel, message, show, ...restProps  }: ConfirmDialogProps) => {
    return (
        <DialogComponent
            // size='md'
            show={show}
            onClose={onCancel}
            title={<IntlMessages id='general.confirmation' />}
            footer={(
                <>
                    <Button
                        isOutline
                        color='info'
                        onClick={onCancel}
                        className='border-0'
                        // icon='bx-pull-left bx-trash'
                    >
                        <IntlMessages id='button.no' />
                    </Button>
                    <Button color='primary' onClick={onConfirm}>
                        <IntlMessages id='button.yes' />
                    </Button>
                </>
            )}
            {...restProps}
        >
            <div className='row'>
                <div className="col-md-12">
                    <h6>{message}</h6>
                </div>
            </div>
        </DialogComponent>
    );
};

export default ConfirmDialog;
