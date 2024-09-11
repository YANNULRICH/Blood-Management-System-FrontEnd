import React from 'react';
import PageWrapper from "../../layout/PageWrapper/PageWrapper";
import Page from "../../layout/Page/Page";
import './conf.scss'
import Button from "../../components/bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {AUTH} from "../../commons/urls/front";

const Confidentialite = () => {
    const navigate = useNavigate()
    return (
        <PageWrapper>
            <Page>
                <div className="mt-5">
                    <h1 className="text-center mb-5">CHARTE DE BON USAGE DE L’OUTIL MY MINEPAT</h1>
                    <h2 className="mb-2">INTRODUCTION</h2>
                    <h3>A. Conditions d'accès à l’outil MyMINEPAT</h3>
                    <p>Tout utilisateur accédant à l’outil MyMINEPAT est considéré avoir au préalable approuvé la présente Charte.</p>
                    <h3>B. But de la Charte</h3>
                    <p>La présente charte a pour but de définir les règles de bonne utilisation de la plateforme. Ces règles relèvent avant tout du bon sens et ont pour seul but d'assurer à chacun l'utilisation optimale de la plateforme.</p>
                    <p>En cas de non-respect de ces règles, les administrateurs se réservent le droit d'intervenir, afin que le plus grand nombre d'utilisateurs puissent bénéficier de conditions de travail les plus satisfaisantes possible.</p>
                    <p>La Charte informe également les utilisateurs sur l'état actuel de la législation camerounaise en matière de cybercriminalité et cybersécurité, ainsi que sur les sanctions pénales encourues (indépendamment des sanctions administratives qui peuvent être appliquées par les différents paliers hiérarchiques du Ministère de l’Economie, de la Planification et de l’Aménagement du Territoire (MINEPAT).</p>

                    <h3>C. Délits informatiques</h3>
                    <p>Le Cameroun dispose dans son arsenal juridique de textes qui ont contribué à l'émergence d'un véritable "droit de la sécurité des systèmes informatiques", notamment :</p>
                    <ul >
                        <li>
                            <p>la loi n°2010/012 du 21 décembre 2010 relative à la cybersécurité et la cybercriminalité au Cameroun et ses textes d’applications conséquents (les articles 74 à 84 relatifs aux sanctions en courues par les utilisateurs en cas de déviance) et,</p>
                        </li>
                        <li>
                            <p>la loi n°2016-07 du 12 juillet 2016 portant Code pénal (en ses articles n°s 162, 219, 240, 295, 300, 304, 305, 307, 31 et 310).</p>
                        </li>
                    </ul>
                    <h3>D. Domaine d'application de la Charte</h3>
                    <p>La présente Charte s'applique à tous les moyens distants relatifs à l’outil : serveurs, ordinateurs, etc., ainsi qu'aux services accessibles à partir des machines locales ou téléphone.</p>

                    <h2 className='ms-3'>I.	DESCRIPTION DES RESSOURCES</h2>
                    <p>La plateforme numérique de diffusion d’informations du MINEPAT est un outil professionnel d’échange et de partage d’informations en vue de l’amélioration de la performance de travail des personnels du MINEPAT. Il est réservé uniquement aux personnels en service au MINEPAT et propose à ces derniers :</p>

                    <ul>
                        <li>l’accès au portail intranet du MINEPAT;</li>
                        <li>le partage d’informations à temps réel, à tous les services cibles ;</li>
                        <li>l’exploitation des données, de l’annuaire téléphoniques et électroniques des personnels en service au MINEPAT;</li>
                        <li>l’information sur les activités majeures menées au MINEPAT et au sein des services ;</li>
                        <li>la gestion d’un agenda synchronisé des activités à mener par le Ministère et au niveau de chaque structure.</li>
                    </ul>
                    <h3>C. Proposition de définition des intervenants</h3>
                    <h3>1. L'utilisateur</h3>
                    <p>Un utilisateur est un consommateur de ressources de MyMINEPAT.
                        Cette utilisation doit obligatoirement être liée à des activités de diffusion d’informations intra et inter structures.
                    </p>
                    <h3>2. L'administrateur</h3>
                    <p>Sur chaque serveur, une ou plusieurs personnes du MINEPAT jouent le rôle d'administrateurs du système et disposent pour cela de droits étendus.</p>

                    <h2 className="ms-3">II. DROITS ET DEVOIRS DES UTILISATEURS</h2>
                    <p>En cas de problème, les utilisateurs peuvent demander l'aide des administrateurs pour que leurs droits soient respectés</p>
                    <h3>A. Informations individuelles</h3>
                    <p>Chaque utilisateur est tenu de fournir des informations individuelles valides (adresse émail, téléphone, lieu de travail et bureau ...). Il leur sera possible de ne modifier que certaines informations.</p>
                    <p>La fourniture d'informations délibérément erronées sera considérée comme une faute grave pouvant entraîner une interdiction d'accès à MyMINEPAT</p>
                    <h3>B. Conditions accès</h3>
                    <p>Tout utilisateur possède un " userid " ou identifiant auquel est associé un mot de passe.</p>
                    <p>La remise de ces deux informations détermine un droit accès, éventuellement limité, aux ressources de MyMINEPAT pour une durée déterminée. L'étendue des ressources auxquelles l'utilisateur a accès peut être limitée en fonction de ses besoins et des contraintes imposées par le partage de ces ressources avec les autres utilisateurs.</p>
                    <p>Ce droit d'accès aux ressources de MyMINEPAT est personnel et incessible.</p>
                    <p>Ce droit d'accès est temporaire. Il est retiré dès lors que la fonction de l'utilisateur ne le justifie plus.</p>
                    <p>Il sera retiré si le comportement d'un utilisateur est en désaccord avec les règles définies dans la présente Charte.</p>
                    <p>Les moyens d'accès éventuellement remis à un utilisateur le sont à titre personnel et incessible.</p>
                    <h3 className="">Chaque utilisateur est responsable de l'usage des ressources informatiques (locales ou distantes) effectué à partir de son compte.</h3>
                    <p>Cela nécessite que des précautions élémentaires soient prises :</p>

                    <ul>
                        <li>adoption d'un mot de passe sur 8 caractères dont deux chiffres et un caractère " exotique " et gardé secret ;</li>
                        <li>changement régulier du mot de passe (et après chaque démonstration en public) ; </li>
                        <li>terminer proprement ses sessions et ne pas quitter son poste de travail avec une session en cours ;</li>
                        <li>prévenir les administrateurs de toute tentative de violation (même non réussie) de son compte ;</li>
                        <li>protéger ses fichiers (enlever les accès non indispensables) ;</li>
                        <li>prévenir les administrateurs de la perte de son téléphone pour la suspension de son droit d’accès.</li>
                    </ul>

                    <h3>C. Respect du caractère confidentiel des informations</h3>
                    <p>Les fichiers de chacun sont privés, même s'ils sont physiquement accessibles : la possibilité de lire un fichier n'implique pas l'autorisation de le vulgariser.</p>
                    <p>Toute tentative de copie des fichiers d'un autre utilisateur sans son autorisation est donc répréhensible.</p>
                    <h3>D. Respect des personnes</h3>
                    <p>Chacun a le droit de travailler sans être dérangé : la liberté de parole n'autorise en rien le harcèlement ou les insultes via post, commentaire, ou autre moyen de communication.</p>
                    <p>La possibilité de modifier un fichier n'implique pas l'autorisation de le modifier (la destruction ou la modification de fichiers utilisateurs relève du vandalisme).
                        La tentative d'usurpation d'identité est un délit.
                    </p>
                    <p><span className="text-underline">Remarque</span> : Un utilisateur non autorisé pourra être déconnecté sans préavis.</p>

                    <h3>F. Engagement de l’utilisateur</h3>
                    <p>Chaque utilisateur s’engage ainsi à : </p>
                    <ul>
                        <li>respecter les règles d’écriture : langue française/anglaise, écriture claire et compréhensible ; </li>
                        <li>s’assurer du caractère public des fichiers, en cas de publication de documents du Ministère ; </li>
                        <li>n’effectuer aucune opération pouvant nuire au bon fonctionnement de la plateforme ; </li>
                        <li>ne pas diffuser de propos, messages ou contenus à caractère marginal, diffamatoire, discriminatoire ou pouvant porter atteinte à la vie privée d’autrui ; </li>
                        <li>ne pas diffuser de coordonnées d’autrui, sans l’autorisation de la personne concernée ; </li>
                        <li>ne pas utiliser cette plateforme à des fins de démarchage commercial, religieux, délictueux, politique, syndicale, criminel ou de nature à troubler l’ordre public ;</li>
                        <li>informer sans délais, la Division Informatique de toute tentative de violation ou anomalie relevée à l’utilisation de ses codes d’accès personnels ou de toute autre anomalie qu’il pourrait constater ;</li>
                        <li>rester vigilant sur les contenus diffusés sur la plateforme et dans leur intervention dans les forums (injures, diffamation, discrimination, pornographie et incitation à la violence proscrites) ;</li>
                        <li>respecter la réglementation camerounaise évoquée plus haut.</li>

                    </ul>
                    <h2>III. DROITS ET DEVOIRS DES ADMINISTRATEURS</h2>
                    <p>Les administrateurs de MyMINEPAT sont responsables de la qualité du service. Ils doivent faire respecter les droits et les responsabilités des utilisateurs.</p>
                    <p>Le MINEPAT se réserve le droit de prendre toute disposition nécessaire pour assumer ces responsabilités et permettre le bon fonctionnement des ressources informatiques communes.</p>

                    <h3>A. Disponibilité des ressources informatiques</h3>
                    <p>Les administrateurs de MyMINEPAT se doivent d'informer les utilisateurs des interruptions volontaires de service.</p>
                    <p>Ils s'emploient à minimiser ces interruptions et à choisir des dates et des heures fixes.</p>
                    <h3>B. Respect de la confidentialité</h3>
                    <p>Les Administrateurs de MyMINEPAT doivent respecter la confidentialité des fichiers utilisateurs, des courriers  auxquels ils peuvent avoir accès.</p>
                    <h3>C. Accès aux données privées </h3>
                    <p>Les Administrateurs de MyMINEPAT peuvent accéder à des fichiers ou courriers pour diagnostic ou correction de problème. </p>
                    <p>Pour assurer la bonne marche du système ou pour vérifier l'application de la Charte, ils peuvent examiner des données appartenant à des utilisateurs.</p>
                    <p>Ils sont tenus de garantir la confidentialité des informations auxquelles ils auront accès au cours de ces démarches.</p>

                    <h3>D. Contrôle de l'utilisation des ressources</h3>
                    <p>Les Administrateurs de MyMINEPAT peuvent surveiller en détail les sessions de travail d'un utilisateur s'il existe un soupçon de non-respect de la Charte.</p>
                    <p>Ils peuvent interrompre toute tâche-utilisateur dans le cas où une utilisation frauduleuse des ressources nuit au bon fonctionnement du système (avec ou sans préavis, selon l'urgence du problème).</p>
                    <p>Ils peuvent mettre sur un support externe ou comprimer les fichiers excessifs ou sans lien direct avec des travaux "normaux" (avec ou sans préavis)</p>
                    <p>Enfin, en cas de dégradation du service, ils peuvent mettre fin aux sessions de travail trop longtemps inactives.</p>

                    <h2>IV.	RESPECT DES RESTRICTIONS LEGALES D'UTILISATION</h2>
                    <p>Les ressources informatiques de MyMINEPAT sont destinées à usage professionnel des personnels du MINEPAT. Elles doivent être utilisées conformément à la législation et réglementation en vigueur.</p>

                    <h2>VII. DELITS ET SANCTIONS EVENTUELLES</h2>
                    <h3>A. Délits</h3>
                    <p>Sont considérés comme des délits, les activités suivantes :</p>

                    <ul>
                        <li>accès ou maintien frauduleux dans un système informatique ;</li>
                        <li>atteintes volontaires au fonctionnement d'un système informatique ;</li>
                        <li>usurpation de titre ;</li>
                        <li>fausses nouvelles ;</li>
                        <li>outrage à la pudeur ;</li>
                        <li>violation de correspondance ;</li>
                        <li>diffamation ;</li>
                        <li>injures ;</li>
                        <li>non-respect du secret professionnel ;</li>
                        <li>déclarations mensongères ;</li>
                        <li>suppression non autorisée des fichiers d’autrui ;</li>
                        <li>la tentative de ces délits, l'association ou l'entente en vue de les commettre.</li>
                        <li>le non-respect des règles de bonne conduite fixées par cette Charte, ainsi que des textes de loi en vigueur, peut conduire à des sanctions administratives ou pénales.</li>
                    </ul>

                    <h3>A. Sanctions administratives</h3>
                    <p>La tentative d'intrusion d'un autre compte, ou du système, de la part d'un utilisateur peut entraîner la suppression de tous ses comptes sur MINEPAT.</p>
                    <p>Les Administrateurs de MyMINEPAT se réservent le droit de refuser l’accès à toute personne ayant violé la présente Charte.</p>
                    <p>Les contrevenants peuvent encourir des sanctions administratives prévues par le Statut Général de la fonction publique camerounaise, sans préjudice des poursuites pénales.</p>
                    <h3>B. Sanctions pénales</h3>
                    <p>Les Administrateurs de MyMINEPAT sont tenus de signaler toute violation des lois et règlements en la matière. </p>
                    <p>Le MINEPAT se réserve le droit d'engager des poursuites au niveau pénal, indépendamment de toute autre sanction administrative.</p>

                    <h2>V.	ACCEPTATION DES CONDITIONS D’UTILISATION</h2>
                    <p>Tout utilisateur déclare avoir pris connaissance des dispositions de la présente Charte et accepte volontairement de respecter l’ensemble de ses règles par son adhésion à la plateforme MyMINEPAT. </p>
                    <p>En se connectant à la plateforme, l’utilisateur s’engage à respecter la Charte d’utilisation de la plateforme et les lois et règlements en vigueur.</p>
                </div>
                <div className="text-end mt-4 mb-3">
                    <Button
                        color="primary"
                        onClick={() => navigate(AUTH.LOGIN)}
                    >
                        Retour a la page de connexion
                    </Button>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default Confidentialite;