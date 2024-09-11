import React, {useEffect, useState} from 'react';
import Dropdown, {DropdownItem, DropdownMenu, DropdownToggle} from "./Dropdown";
import Icon from "../icon/Icon";
import Button from "../bootstrap/Button";
import './RevueDocumentaire.scss';
import {useNavigate} from "react-router-dom";
import {joinUrlWithParamsId} from "../../commons/helpers/funcHelper";
import {useAppSelector} from "../../store/redux.types";
import pdfLogo from '../../assets/img/landing2/pdfLogo.png';
import { globalT } from '../../lang';
import LANG from "../../lang/language";
import NotificationManager from "../notifications/NotificationManager";
import dayjs, {Dayjs} from "dayjs";
// Définissez les props que vous passerez au composant
interface RevueDocumentaireProps {
    hasDetail?: boolean,
    id: string;
    name: string;
    description: string;
    autors: string;
    year: Dayjs;
    onClick: (file: string) => void; // Ajoutez ceci pour traiter le clic sur le bouton Voir
    file: string;
    hasAnotherAction?: boolean,
    type: 'word' | 'pdf' | 'excel' | 'presse'; // Spécifiez les types acceptés
    action?: { delete?: () => void, edit?: () => void, valider?: () => void, invalider?: () => void },
}

const RevueDocumentaire: React.FC<RevueDocumentaireProps> = ({autors, description, year, hasDetail= true, id, name, file, type,action, hasAnotherAction, onClick}) => {
    const navigate = useNavigate()

    const { settings, authUserData } = useAppSelector(({ settings, authUser, }) => ({
        settings,
        authUserData: authUser.data
    }));

    const handleDownload = () => {
        // const blob = base64ToFile(file, `application/${type}`);
        // const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = file;
        link.target = "_blank"
        link.download = `${name}.${type}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(file)
            .then(() => {
                NotificationManager.success(globalT("link.copy.success"));
            })
            .catch((error) => {
                console.error('Erreur lors de la copie du lien :', error);
            });
    };


    const getTypeIcon = () => {
        switch (type) {
            case 'word':
                return "path_to_word_icon";
            case 'pdf':
                return "path_to_pdf_icon";
            case 'excel':
                return "path_to_excel_icon";
            case 'presse':
                return "path_to_presse_icon";
            default:
                return "path_to_default_icon";
        }
    }

    return (
        <div className="card revueDocumentaire-card" id={id}>
            <div className="card-body d-flex flex-column">
                {authUserData && action && (
                    <Dropdown>
                        <DropdownToggle hasIcon={false}>
                            <Button>
                                <Icon icon='MoreVert' size='2x'  />
                            </Button>
                        </DropdownToggle>
                        <DropdownMenu>
                            {/*<DropdownItem>*/}
                            {/*    <button className="btn text-black" role="button" onClick={() => navigate(joinUrlWithParamsId('/actualite/:id', id as string)) }>Detail</button>*/}
                            {/*</DropdownItem>*/}
                            <DropdownItem>
                                <button onClick={action.edit} className="btn text-primary" role="button">{globalT("button.edit.pub")}</button>
                            </DropdownItem>
                            <DropdownItem>
                                <button onClick={action.delete} className="btn text-red" role="button">{globalT("button.delete.pub")}</button>
                            </DropdownItem>
                            {hasAnotherAction && (
                                <>
                                    <DropdownItem>
                                        <button onClick={action.valider} className="btn text-success" role="button"> {globalT("button.valid.pub")}</button>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <button onClick={action.invalider} className="btn text-red" role="button"> {globalT("button.invalid.pub")}</button>
                                    </DropdownItem>
                                </>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                )}
                <h5 className="card-title text-center" style={{ overflow: 'hidden'}}>{name}</h5>
                {/*<img src={pdfLogo} style={{width: '70px', height: '70px'}} className="card-img-top mx-auto d-block" alt={type} />*/}
                <div className="card-body d-flex flex-column">
                    <div className="d-flex flex-column"style={{fontSize: "1.2rem"}}>
                        <div className="">
                            <span className="fw-bold">Auteur:</span> <span>{autors}</span>
                        </div>
                        <div className="">
                            <span className="fw-bold">Annee de publication:</span> <span>{ dayjs(year).format("ll") }</span>
                        </div>
                    </div>
                    {/*<p>{description}</p>*/}
                    <div className="d-flex flex-column mt-3">
                        <button  onClick={() => onClick(file)} className="btn btn-success mt-auto text-center mb-1" style={{  backgroundColor: '#f8f8f8', color: '#333',opacity: '0.8',transition: 'opacity 0.3s ease'}} >Voir le PDF</button>
                        {/*<a id="pdfLink" className="btn btn-danger mt-auto text-center" href={file} style={{  backgroundColor: '#f8f8f8', color: '#333',opacity: '0.8',transition: 'opacity 0.3s ease'}} download> Télécharger le fichier PDF </a>*/}
                        <button onClick={handleDownload} className="btn btn-danger mt-auto text-center" style={{  backgroundColor: '#f8f8f8', color: '#333',opacity: '0.8',transition: 'opacity 0.3s ease'}}>Télécharger le fichier PDF</button>
                        {/*<button onClick={copyToClipboard} className="btn btn-primary mt-auto text-center" style={{  backgroundColor: '#f8f8f8', color: '#333',opacity: '0.8',transition: 'opacity 0.3s ease'}}>Copier le lien du PDF</button>*/}

                    </div>
                   </div>
            </div>

        </div>
    );
}

export default RevueDocumentaire;
