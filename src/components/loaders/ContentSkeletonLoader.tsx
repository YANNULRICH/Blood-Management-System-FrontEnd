// @ts-nocheck
import React from 'react';
import "./style.scss";

const ContentSkeletonLoader = () => (
    <div className="center-hor-ver vh-100">
        <div className="dot-anim">
            <div className="circle" />
            <div className="circle" />
            <div className="circle" />
            <div className="shadow" />
            <div className="shadow" />
            <div className="shadow" />
        </div>
    </div>
);

export default ContentSkeletonLoader;
