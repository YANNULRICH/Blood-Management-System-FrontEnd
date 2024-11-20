import React from 'react';
import dayjs, {Dayjs} from "dayjs";
import Carousel from "../bootstrap/Carousel";
import Dropdown, {DropdownItem, DropdownMenu, DropdownToggle} from "../bootstrap/Dropdown";
import Icon from "../icon/Icon";
import Button from "../bootstrap/Button";
import {useAppSelector} from "../../store/redux.types";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";
import './YourStylesheet.scss';
import {globalT} from "../../lang";
import {PublicationStatus} from "../../commons/enums/PublicationStatus";


interface CardProps {
    images?:string[],
    authorName: string
    date?: Dayjs,
    content?: string,
    state: string,
    title?: string,
    id?: string,
    hasAnotherAction?: boolean,
    categoryName?: string[],
    action?: {  detail?:() => void,delete?: () => void, edit?: () => void, valider?: () => void, invalider?: () => void },
    ability?: {edit: boolean, delete: boolean, validate?: boolean, invalidate?: boolean}

}

const CardImg: React.FC<CardProps> = ({title, content, images, state, hasAnotherAction, ability, date, id, action,authorName,categoryName}) => {
    const { authUserData } = useAppSelector(({ authUser, }) => ({
        authUserData: authUser.data
    }));
    const navigate = useNavigate()


    return (
        <div className="card h-100" id={id}>
            {images && images.length === 0 && (
                <div className="ms-1 mt-3 mb-3">
                    <h5 className="card-title">{ title}</h5>
                    {/*<p className="card-text">{description}</p>*/}
                </div>
            )}
            {images && images?.length > 0 ? (
                <Carousel
                    items={images?.map(img => ({src: img, type: "IMAGE", isDetail: false}))}
                    className="custom-carousel"/>
            ) : (
                <p className="ms-1 me-1 mt-3" style={{fontSize: "1.4rem", height: "290px"}}>{content}</p>
            )}

            {images && images.length > 0 && (
                <div className="ms-1 mt-3">
                    <h5 className="card-title">{ title}</h5>
                    {/*<p className="card-text">{description}</p>*/}
                </div>
            )}

            <div className="row mt-2 style-footer">
                <div className="col-5 ms-2">
                    <p><Icon className="" color="primary" icon="CalendarToday" /><span> {dayjs(date).format('ll')}</span></p>
                </div>
                <div className="col-5">
                    <p><Icon className="" color="primary" icon="Person" /><span> {authorName}</span></p>
                </div>
            </div>
            {/*<span className="text-primary style-footer ms-3">{categoryName?.map(c => (<span>{c.toLocaleUpperCase()}, </span>))}</span>*/}

            <div className="card-footer">
                <div className="col-10 d-flex flex-column justify-content-between">
                </div>
                <div className="col-2 text-start">
                    { action && (
                        <Dropdown>
                          <DropdownToggle hasIcon={false}>
                            <Button>
                                <Icon icon='MoreVert' size='2x' />
                            </Button>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <button className="btn text-black" role="button" onClick={action.detail}>{globalT("button.detail.pub")}</button>
                            </DropdownItem>
                            <>
                                {ability?.edit && (
                                    <DropdownItem>
                                        <button onClick={action.edit} className="btn text-primary" role="button">{globalT("button.edit.pub")}</button>
                                    </DropdownItem>
                                )}
                                {ability?.delete && (
                                    <DropdownItem>
                                        <button onClick={action.delete} className="btn text-red" role="button">{globalT("button.delete.pub")}</button>
                                    </DropdownItem>
                                )}
                            </>

                            {hasAnotherAction && (
                                <>
                                    {[PublicationStatus.invalidate.value, PublicationStatus.staging.value].includes(state) && (
                                        ability?.validate && (
                                            <DropdownItem>
                                                <button onClick={action.valider} className="btn text-success" role="button">{globalT("button.valid.pub")}</button>
                                            </DropdownItem>
                                        )
                                    )}

                                    {PublicationStatus.validate.value === state && (
                                        ability?.invalidate && (
                                            <DropdownItem>
                                                <button onClick={action.invalider} className="btn text-red" role="button">{globalT("button.invalid.pub")}</button>
                                            </DropdownItem>
                                        )
                                    )}
                                </>
                            )}
                            
                        </DropdownMenu>
                        </Dropdown>
                    )}
                </div>
            </div>
            
            
        </div>
    )
}

export default CardImg;
