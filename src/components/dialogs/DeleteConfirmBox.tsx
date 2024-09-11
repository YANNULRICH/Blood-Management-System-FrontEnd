import React from 'react';
import {globalT} from "../../lang";
import SwalConfirmDialog, {SwalConfirmDialogProps} from "./SwalDialog";

type DeleteConfirmBoxProps = {
    launcher: SwalConfirmDialogProps['launcher'],
    message: string,
    onConfirm: SwalConfirmDialogProps['onConfirm'],
    onCancel: SwalConfirmDialogProps['onCancel'],
}

const DeleteConfirmBox = ({ launcher, onConfirm, onCancel, message }: DeleteConfirmBoxProps): JSX.Element => (
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
            icon: 'error',
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
                cancelButton: 'btn btn-outline-danger me-3',
                confirmButton: 'btn btn-danger',
                container: 'custom-swal-container one-btn'
            }
        })}
    />
);

export default DeleteConfirmBox;
