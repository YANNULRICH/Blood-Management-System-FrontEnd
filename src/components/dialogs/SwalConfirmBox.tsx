import React from 'react';
import {globalT} from "../../lang";
import SwalConfirmDialog, {SwalConfirmDialogProps} from "./SwalDialog";

type SwamConfirmBoxProps = {
    launcher: SwalConfirmDialogProps['launcher'],
    message: string,
    onConfirm: SwalConfirmDialogProps['onConfirm'],
    onCancel: SwalConfirmDialogProps['onCancel'],
}

const SwamConfirmBox = ({ launcher, onConfirm, onCancel, message }: SwamConfirmBoxProps): JSX.Element => (
    <SwalConfirmDialog
        launcher={launcher}
        onConfirm={onConfirm}
        title={(
            <p className='mb-3 text-size-x-large'>
                {message}
            </p>
        )}
        onCancel={onCancel}
        // @ts-ignore
        swalProperties={(swalConfig) => ({
            // width: '40em',
            icon: 'question',
            // iconColor: 'text-primary',
            showCloseButton: false,
            reverseButtons: true,
            confirmButtonText: (
                <span>
                    {globalT('button.yes')}
                </span>
            ),
            cancelButtonText: (
                <span>
                    {globalT('button.no')}
                </span>
            ),
            customClass: {
                // @ts-ignore
                ...swalConfig.customClass,
                icon: 'border-primary text-primary',
                cancelButton: 'btn btn-outline-primary me-3',
                confirmButton: 'btn btn-primary',
                container: 'custom-swal-container one-btn'
            }
        })}
    />
);

export default SwamConfirmBox;
