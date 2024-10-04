import React, {useState} from 'react';
import "./Nav.scss"
import {globalT} from "../../../lang";
import LANG, {getLangWithKey} from "../../../lang/language";
import {AUTH} from "../../../commons/urls/front";
import {useAppDispatch, useAppSelector} from "../../../store/redux.types";
import {useNavigate} from "react-router-dom";
import {LanguageDict} from "../../../commons/types";
import {setLanguage} from "../../../store/slices/settings/actions";
import {getJwtData} from "../../../commons/helpers/jwtHelper";
import Button from "../../../components/bootstrap/Button";
import classNames from "classnames";
import logo from "../../../assets/images/logo.jpeg"

type navProps = {
    mode: 'home' | 'donate' | 'request'
}

const NavHeader = ({mode}:navProps) => {

    const { settings, authUserData } = useAppSelector(
        ({ settings, authUser }) => ({
            settings,
            authUserData: authUser.data,
        })
    );
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const jwtData = getJwtData();
    const [show, setShow] = useState(false)



    const changeLanguage = (locale: LanguageDict) => {
        if (locale !== settings.language) {
            dispatch(setLanguage(locale));
        }
    };
    return (
        <div className="global-header">
            <div className="ctn-header z-index-10">
                <div className="row w-100 d-flex align-items-center">
                    <div className="logo-header col-6 col-xl-1">
                        <img src={logo} className="img-fluid" alt=""/>
                    </div>
                    <div className= {classNames("d-block d-flex justify-content-end d-xl-block d-lg-block ps-3 ctn-nav col-0  col-xl-9")}>
                        <ul className="header-menu">
                            <li className="heauser-link">
                                <a href="#" className={classNames("a_link",{a_linkActivate: mode === "home"})} onClick={() => null}>HOME</a>
                            </li>
                            <li className="heauser-link">
                                <a href="#" className={classNames("a_link",{a_linkActivate: mode === "donate"})} onClick={() => null}>DONATE BLOOD</a>
                            </li>
                            <li className="heauser-link">
                                <a href="#" className={classNames("a_link",{a_linkActivate: mode === "request"})} onClick={() => null}>REQUEST FOR BLOOD</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-6 col-xl-2 mt-xl-0 mt-3">
                        <div className="d-flex justify-content-end">

                            {!(jwtData && authUserData) && (
                                <Button
                                    color={"primary"}
                                    size={"lg"}
                                    className="text-black"
                                    onClick={() => navigate(AUTH.LOGIN)}
                                >
                                    {globalT("Connexion")}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default NavHeader;