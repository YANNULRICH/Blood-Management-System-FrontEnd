import {LanguageDict} from "../commons/types";

const LANG: Record<LanguageDict, {
	text: string,
	locale: LanguageDict,
}> = {
	en: {
		text: 'language.en',
		locale: 'en',
	},
	fr: {
		text: 'language.fr',
		locale: 'fr',
	},
};

export const getLangWithKey = (key: LanguageDict) => {
	return LANG[key];
};

export default LANG;
