import React from 'react';
import "./card.scss"
import Icon from "../../components/icon/Icon";

type cardProps = {
    logo: string,
    text: string
}

const CardHeader = ({text,logo}: cardProps) => {

    return (
        <div className="cardContent">
            <img src={logo} className="cardContent__logo" alt=""/>
            <span className="cardContent__text">{text}</span>
            <Icon icon={"ArrowRight"} className={"cardContent__icon"} color={"dark"} size={"lg"} />
        </div>
    );
};

export default CardHeader;