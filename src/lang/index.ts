/**
 * App Language Provider
 * Add more locales here
 */
import dayjs from 'dayjs';
import { createIntl, createIntlCache } from 'react-intl';
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat';

import * as locales from './locales';
import appStore from '../store/appStore';
import { Language, LanguageDict } from '../commons/types';
import { getDefaultLanguage } from '../commons/helpers/funcHelper';

// Prepare locale for dates
require('dayjs/locale/en');
require('dayjs/locale/fr');

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

const AppLocale: Record<LanguageDict, Language> = {
	'en': locales.EnLang,
	'fr': locales.FrLang,
};

// Get language for int API
let currentAppLocale = AppLocale[getDefaultLanguage()];

// Dates configuration
// Check to apply chosen locale because by default en is applied
if (currentAppLocale.locale !== locales.EnLang.locale) {
	dayjs.locale(currentAppLocale.locale);
}

// @ts-ignore
let intl = createIntl(currentAppLocale, cache);

export type IntlValuesParam = Record<string, PrimitiveType | FormatXMLElementFn<string, string>>;

/**
 * Programmatically access to internationalization
 * Usefully for non components file
 * @param id
 * @param values
 */
export const globalT = (id: string, values?: IntlValuesParam) => {
	// Get current locale
	const currentLocale = appStore.getState().settings.language

	// Check if the starting locale is different from the ending locale
	// In such case, reload the intl and currentAppLocale variables
	if (currentAppLocale.locale !== currentLocale) {
		currentAppLocale = AppLocale[currentLocale]
		// @ts-ignore
		intl = createIntl(currentAppLocale, cache)
	}

	return intl.formatMessage({ id }, values)
}

export const onIntlError = (err: any) => {
	if (err.code === "MISSING_TRANSLATION") {
		console.warn("Missing translation", err.message);
		return;
	}
	throw err;
};

export default AppLocale;
