import React from 'react';
import Page from "../../layout/PageWrapper/Page";
import NoDataSvg from '../../assets/images/undraw_no_data_re_kwbl.svg';
import IntlMessages from "../IntlMessages";
import Button from "../bootstrap/Button";

export type EmptyResultProps = {
    emptyText?: React.ReactNode,
    onAddClick?: () => void,
    addText?: React.ReactNode;
}

const EmptyResult = ({ emptyText, addText, onAddClick }: EmptyResultProps) => {
    return (
        <Page>
            <div className='row g-4'>
                <div className="center-hor">
                    <div className='text-center'>
                        <img
                            width={200}
                            height='auto'
                            src={NoDataSvg}
                            alt={"item.title"}
                            className='img-fluid object-fit-contain'
                        />
                        <h3 className='mt-4 mb-4'>
                            {emptyText || <IntlMessages id="resource.empty.text"/>}
                        </h3>
                        {onAddClick && (
                            <div className='text-center'>
                                <Button
                                    color='primary'
                                    isLight={false}
                                    className='rounded-1'
                                    icon='bx-plus bx-pull-left'
                                    onClick={() => onAddClick()}
                                >
                                    {addText || <IntlMessages id='resource.empty.text.btn' />}
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Page>
    );
};

export default EmptyResult;
