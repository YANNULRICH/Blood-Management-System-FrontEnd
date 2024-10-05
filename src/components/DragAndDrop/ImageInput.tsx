import React from 'react';
import A11yButton from "../A11yButton";
import Icon from '../icon/Icon';

export type ImageInputType = {
    imageUrls: string[];
    wrapperClassName?: string;
    onDeleteClick?: (imageUrl: string) => any;
}

/**
 * Handle deleteable image
 * @param imageUrls
 * @param onDeleteClick
 * @param wrapperClassName
 * @constructor
 */
const ImageInput = ({imageUrls, onDeleteClick, wrapperClassName = ''}: ImageInputType) => (
    <div className={`image-input ${wrapperClassName}`}>
        <div className="row">
            {imageUrls.map((imageUrl, index, arr) => (
                <div
                    key={index}
                    className={`col-md-${arr.length > 1 ? '4' : '12'}`}>
                    <div
                        className="thumb2-item">
                        <div className="thumb-wrap">
                            <img
                                alt=""
                                src={imageUrl}
                                className="img thumb-elt"
                            />
                        </div>
                        <A11yButton<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
                            elementType="div"
                            onClick={() => onDeleteClick ? onDeleteClick(imageUrl) : null}
                            className="close-btn cursor-pointer center-hor-ver"
                        >
                            <Icon icon='Close' size='2x' color='light' />
                        </A11yButton>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ImageInput;
