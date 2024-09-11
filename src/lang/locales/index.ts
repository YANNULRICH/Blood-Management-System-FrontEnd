import enMessages from "./en.json";
import frMessages from "./fr.json";
import {Language} from "../../commons/types";

export const EnLang : Language = {
    id: 'en',
    locale: 'en',
    name: 'language.en',
    messages: enMessages,
};

export const FrLang : Language = {
    id: 'fr',
    locale: 'fr',
    name: 'language.fr',
    messages: frMessages,
};