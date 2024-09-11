// @ts-nocheck
import dayjs from "dayjs";
import {LanguageDict} from "../types";
import StorageHelper, {StorageKeys} from "./StorageHelper";
import config from "../../config";
import {FieldError, FieldErrors} from "react-hook-form/dist/types/errors";

export function stringToBool(val: unknown) {
	if (['true', '1', 1, true].includes(val))
		return true;
	else if (['false', '0', 0, false].includes(val))
		return false;
	return null;
}

export function getOS() {
	const { userAgent } = window.navigator;
	const { platform } = window.navigator;
	const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
	const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
	const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
	let os = null;

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = 'MacOS';
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		os = 'iOS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = 'Windows';
	} else if (/Android/.test(userAgent)) {
		os = 'Android';
	} else if (!os && /Linux/.test(platform)) {
		os = 'Linux';
	}

	document.documentElement.setAttribute('os', os);
	return os;
}

export const hasNotch = () => {
	/**
	 * For storybook test
	 */
	const storybook = window.location !== window.parent.location;
	const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
	const aspect = window.screen.width / window.screen.height;
	const aspectFrame = window.innerWidth / window.innerHeight;
	return (
		(iPhone && aspect.toFixed(3) === '0.462') ||
		(storybook && aspectFrame.toFixed(3) === '0.462')
	);
};

export const mergeRefs = (refs) => {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref != null) {
				ref.current = value;
			}
		});
	};
};

export const randomColor = () => {
	const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];

	const color = Math.floor(Math.random() * colors.length);

	return colors[color];
};

export const priceFormat = (price) => {
	return price.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});
};

export const average = (array) => array.reduce((a, b) => a + b) / array.length;

export const percent = (value1, value2) => ((value1 / value2 - 1) * 100).toFixed(2);

export const getFirstLetter = (text, letterCount = 2) =>
	text
		.toUpperCase()
		.match(/\b(\w)/g)
		.join('')
		.substring(0, letterCount);

export const debounce = (func, wait = 1000) => {
	let timeout;

	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

/**
 * Get browser locale
 * @returns {string}
 */
export const getLocaleFromBrowser = (): string => {
	// @ts-ignore Allow userLanguage since its for old browsers version
	const browserLanguage: string = window.navigator.language || window.navigator.userLanguage;
	return browserLanguage.split('-')[0];
};

/**
 * Get the default language i.e previous language or browser language or english in case of not found
 * @returns {*}
 */
export function getDefaultLanguage() : LanguageDict {
	// Get user locale
	let userLanguage = StorageHelper.getItem(StorageKeys.LANGUAGE);

	// In case of not found, get browser locale
	if (!userLanguage) {
		userLanguage = getLocaleFromBrowser();
	}

	// In case of not found or any other unknown value, fallback to default language
	const initialLanguage: LanguageDict = config.language.available.includes(userLanguage as LanguageDict)
		? (userLanguage as LanguageDict)
		: config.language.defaultValue;

	// Reset locale storage with good value since many options were possible
	StorageHelper.setItem(StorageKeys.LANGUAGE, initialLanguage);

	// Tweak it  to fr for now
	return 'fr';
	// return initialLanguage;
}

/**
 * Check if a given value is a real object
 * E.g: {name: "Jack"} is a real object
 * @param value
 */
export const isLiteralObject = (value: any) => !!value && value.constructor === Object;

/**
 * Allow accessibility for components
 * @param handler
 */
export function keyDownA11y(handler: Function | undefined) {
	return function onKeyDown(event: any) {
		if (
			handler
			&& event
			&& ['keydown', 'keypress'].includes(event.type)
			&& ['Enter', ' '].includes(event.key)
		) {
			handler(event);
		}
	}
}

/**
 * Generate a unique id
 * @returns {string}
 */
export const generateId = (): string => new Date().valueOf().toString(36) + Math.random().toString(36).substr(2);

/**
 * Round a number to given decimal
 * @param num (undefined for compatibility)
 * @param decimal > 0
 */
export const round = (num: number | undefined, decimal = 2): number => {
	if (decimal <= 0 || num === undefined)
		return NaN;
	const divider = Number(`1${Array.from({length: decimal}, () => '0').join('')}`);

	return Math.round((num + Number.EPSILON) * divider) / divider;
}

/**
 * Format a file size to human readable
 * @param size
 */
export const formatFileSize = (size: number) => {
	if (size > 1024 * 1024 * 1024)
		return {
			originalSize: size,
			formattedSize: `${round(size / (1024 * 1024 * 1024), 2)} GB`,
		};
	if (size > 1024 * 1024)
		return {
			originalSize: size,
			formattedSize: `${round(size / (1024 * 1024), 2)} MB`,
		};
	if (size > 1024)
		return {
			originalSize: size,
			formattedSize: `${round(size / 1024, 2)} KB`,
		};

	return {
		originalSize: size,
		formattedSize: `${round(size, 2)} Bytes`,
	}
}

/**
 * Check if a given value is a "safe" falsy which means falsy values without 0, -0, 0n
 * @param value
 */
export const isNotSafeFalsy = (value: any) => ![false, '', NaN, null, undefined].includes(value);

/**
 * Bind params to a given url
 * @param to
 * @param params
 */
export const joinUrlWithParams = (to: string, params: Array<{ param: string; value: any }>) => {
	let url = to;
	params.forEach(param => {
		url = url.replace(`:${param.param}`, `${encodeURIComponent(param.value)}`);
	});

	return url;
};

/**
 * Shortcut of joinUrlWithParams for Id
 * @param to
 * @param id
 */
export const joinUrlWithParamsId = (to: string, id: string | number) => joinUrlWithParams(to, [{ param: 'id', value: id }]);

/**
 * Mock
 * @param params
 * @param shouldSucceed
 * @param time
 */
export const delay = (params?: any, shouldSucceed?: boolean,  time?: number) => new Promise((resolve, reject) => {
	setTimeout(() => {
		const func = (shouldSucceed === undefined || shouldSucceed) ? resolve : reject;
		func(params);
	}, time === 0 ? time : (time || 800));
});

/**
 * Paralyze an operation
 */
export const deferTask = (callback: () => void) => setTimeout(callback, 0);


/**
 * Check if a something is numeric.
 * Optionally allow a filter to allow only positive or negative number
 * @param num
 * @param sign null || '+' || '-'
 * @param strict Indicate if num must be of type number
 * @returns {boolean}
 */
export const isNumeric = (num: any, sign: null | '+' | '-' = null, strict = false) => {
	const _isNumeric = strict
		? typeof num === 'number' && !Number.isNaN(num)
		: (typeof num === 'number' || typeof num === "string" && num.trim() !== '') && !Number.isNaN(num);
	return sign === null
		? _isNumeric
		: sign === '+'
			? _isNumeric && num >= 0
			: _isNumeric && num <= 0;
};

/**
 * Generate a fetch code for resource data
 * @param method
 * @param params
 * @param resource
 * @param setResource
 */
export const fetchResource = (method: any, params: any, resource: any, setResource: any) => {
	setResource({
		...resource,
		loading: true,
	});
	method(...params)
		.then((result: any) => {
			setResource({
				loading: false,
				// @ts-ignore
				data: result.data,
				error: undefined
			});
		})
		.catch((error: any) => {
			setResource({
				// @ts-ignore
				error,
				loading: false,
				data: undefined,
			});
		});
}

/**
 * Get UTC Date object
 */
export const getUTCDate = (): Date => {
	const d = new Date();
	return new Date(
		d.getUTCFullYear(),
		d.getUTCMonth(),
		d.getUTCDate(),
		d.getUTCHours(),
		d.getUTCMinutes(),
		d.getUTCSeconds()
	);
}

/**
 * Listener of closing (page/tab) action
 * In others more, used with window.addEventListener('beforeunload', closingEventListener), prevent
 *   the browser from closing by showing a confirm dialog
 * @param e
 */
export const closingEventListener = (e: any) => {
	const event = e || window.event;

	// For IE and Firefox prior to version 4
	if (event) {
		// Cancel the event
		event.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
		// Chrome requires returnValue to be set
		event.returnValue = 'Confirm';
	}

	// For Safari
	return 'Confirm';
};

/**
 * Return price with Unit
 * @param price
 */
export const getPriceWithUnit = (price: number | string) => `${price} €`;

/**
 * Check if a given string is a guid or uuid
 * @param uuid
 * @param version
 */
export const isUUID = (uuid: unknown, version: 'v1' | 'v2' | 'v3' | 'v5' | 'all' = 'all') => {
	// Gather a patter for each uuid version
	// const VALID_PATTERN = '\A[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\z';
	const uuidVersionPattern = {
		v1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
		v2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
		v3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
		v4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		v5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
	};

	return uuidVersionPattern[version].test(uuid);

	// return Object.values(uuidVersionPattern).some(pattern => pattern.test(uuid));
}

/**
 * Create an error with custom properties
 * @param message
 * @param properties
 */
export const createErrorWithProperties = (
	message: string | undefined = undefined,
	properties: Record<string, string | number> = {}
) => {
	const err = new Error(message);
	Object.entries(properties)
		.forEach(obj => {
			// @ts-ignore
			err[obj[0]] = obj[1];
		});
	return err;
}

/**
 * Download a content from url
 * @param url
 */
export const downloadContent = (url: string) => {
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);

	a.href = url;

	a.click();
	window.URL.revokeObjectURL(a.href);
	document.body.removeChild(a);
};

export type DeepMapObject = (
	obj: Array<any> | Record<string | number, any>,
	validateKey?: (key: string | number) => boolean,
	transformKey?: (key: string | number) => string | number,
	transformValue?: (value: any) => any,
) => Array<any> | Record<string | number, any>;

/**
 * Deep mapping an object and apply some transformation
 * @param obj A variable of type array or raw object
 * @param validateKey function to filter key to apply transformations
 * @param transformKey function to transform an key to a new one
 * @param transformValue function to transform a value to a new one
 */
export const deepMapObject: DeepMapObject = (
	obj,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validateKey = (key: string | number) => true,
	transformKey = (key: string | number) => key,
	transformValue = (value: any) => value
) => {
	let rtn = obj;
	if (typeof (obj) === 'object') {
		if (obj instanceof Array) {
			rtn = obj.map(item => deepMapObject(item, validateKey, transformKey, transformValue));
		} else {
			rtn = {};
			Object.entries(obj).forEach(([key, value]) => {
				if (validateKey(key)) {
					// apply the change on the string
					const newKey = transformKey(key);

					// Falsy or primitive value
					if (!value || typeof value !== 'object')
						// @ts-ignore
						rtn[newKey] = transformValue(value);

						// nested object
					// @ts-ignore
					else rtn[newKey] = deepMapObject(value, validateKey, transformKey, transformValue);
				}
					// Continuous looping in case of object type
				// @ts-ignore
				else rtn[key] = !value || typeof value !== 'object'
					? value
					: deepMapObject(value, validateKey, transformKey, transformValue);
			});
		}
	}
	return rtn;
}

export function stringToCamelCase(str: string) {
	return str.replace(/(_\w)/g, k => k[1].toUpperCase())
}

// export function stringToCamelCase(str: string) {
//   return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
//     return index == 0 ? word.toLowerCase() : word.toUpperCase();
//   }).replace(/\s+/g, '');
// }

// export function stringToCamelCase(str) {
// 	return str.replace(/[\s_]+(\w)/g, '$1');
// }

export function capitalize(str: string) {
	return str.replace(str[0], str[0].toUpperCase())
}

/**
 * Convert a value to camelCase
 * @param value
 */
export function toCamelCase(value: any) {
	if (typeof value === 'string') {
		return stringToCamelCase(value);
	}

	return deepMapObject(value, undefined, stringToCamelCase);
}

/**
 * Convert a string to snake_case
 * @param str
 */
export function stringToSnakeCase(str: string) {
	return str.replace(/\W+/g, " ")
		.split(/ |\B(?=[A-Z])/)
		.map(word => word.toLowerCase())
		.join('_');
}

/**
 * Convert a value to snake case
 * @param value
 */
export function toSnakeCase(value: any): string | Record<string | number, any> {
	if (typeof value === 'string') {
		return stringToSnakeCase(value);
	}

	return deepMapObject(value, undefined, stringToSnakeCase);
}

/**
 * Transform an object to form data
 * Handle the special case of array of input.
 *    And for that, just need to have in object keys like file[]1, file[]2, etc. it'll be transformed to one key of the form data
 * @param obj
 * @param skipTrueNullishValue Whether to include or not null, undefined, NaN
 */
export const objectToFormData = (obj: object, skipTrueNullishValue = true) => {
	let formData = new FormData();
	if (obj instanceof FormData) {
		formData = obj;
	} else {
		Object.entries(obj)
			.forEach(item => {
				const [key, value] = item;
				if (skipTrueNullishValue && [null, NaN, undefined].includes(value))
					return;

				if (key.includes('[]')) {
					const _key = key.split('[]')[0];
					formData.append(`${_key}[]`, value);
				}
				else formData.append(key, value);
			});
	}
	return formData;
};

/**
 * Get query of url
 * @param useLocation
 * @returns {URLSearchParams}
 */
export const useQuery = (useLocation) => new URLSearchParams(useLocation().search);


/**
 * Convert an UTC date to locale date
 * @param utcDate
 */
export const utcToLocaleDate = (utcDate: string): string => {
	const _utcDate = /Z$/.test(utcDate) ? utcDate : `${utcDate}Z`;
	return new Date(_utcDate).toString();
}

/**
 * Stringify digit. If digit less than 10, prefix with 0
 * @param value
 */
export const stringifyDigit = (value: number) => value < 10 ? `0${value}` : value;


export const numberFormatter = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'EUR',
	minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
});

export const formatNumber = (number: any, unit?: string): string => {
	// eslint-disable-next-line eqeqeq
	if (Number(number) || number == 0) {
		let _n = numberFormatter.format(number).toString();
		// Remove " €" from number to allow other units
		_n = _n.replace(/\s€/, '');
		// Increase space size for better visibility
		_n = _n.replace(/\s/ig, '  ');
		return `${_n}${unit === undefined
			? ' €'
			: unit === ''
				? ''
				: ` ${unit}`}`;
	}
	return `⚊`;
}

/**
 * Format date for display
 * @param date
 * @param format
 * @param emptyValue
 */
export const formatDate = (date: dayjs.Dayjs | undefined | null, format = 'lll', emptyValue = '⚊') => {
	if (date) {
		const _date = dayjs.isDayjs(date) ? date : dayjs(date);
		return _date.isValid() ? _date.format(format) : emptyValue;
	}
	return emptyValue;
}

export const formatOptionalText = (text: string | undefined) => text ||  '⚊';

/*
function setCookie(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
*/

export const eraseCookie = (name: string) => {
	document.cookie = name+'=; Max-Age=-99999999;';
}

/**
 * Perform action request
 * @param verb
 * @param url
 * @param typeBase
 * @param dispatch
 * @param data
 * @param config
 * @returns {Promise<any> | * | Promise<T | never> | undefined}
 */
export const makeActionRequest = (verb, url, typeBase, dispatch, data = null, config = {} ) => {
	dispatch({ type: typeBase });
	return makeRequest(verb, url, data, config)
		.then((response) => {
			dispatch({ type: `${typeBase}_SUCCESS`, payload: response });
			return Promise.resolve(response);
		})
		.catch((error) => {
			dispatch({ type: `${typeBase}_FAILURE` });
			return Promise.reject(error);
		});
};

export const makeActionRequestNetwork = <ResponseType>(
	dispatch: any,
	typeBase: string,
	fetchData: Function,
	transformData?: (response: any) => ResponseType = (response) => response.data.data as ResponseType,
	...params
): Promise<ResponseType> => {
	dispatch({ type: typeBase });
	return fetchData(...params)
		.then((response) => {
			const data = transformData(response);
			dispatch({ type: `${typeBase}_SUCCESS`, payload: data });
			return Promise.resolve(data);
		})
		.catch((error) => {
			dispatch({ type: `${typeBase}_FAILURE` });
			return Promise.reject(error);
		});
};

/**
 * Reverse object.entries operation
 * @param arr {Array}
 * @returns {Object}
 */
export const fromEntries = (arr) => {
	return arr.reduce((acc,[k,v])=>({...acc,[k]:v}),{});
};

/**
 * Capitalize the first letter of a string
 * @param str
 */
export const ucfirst = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Lowercase the first letter of a string
 * @param str
 */
export const lcfirst = (str: string) => {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Deeply resolve error object for react-hook-form
 * @param errors
 * @param name
 */
export const resolveFieldError = (errors: FieldErrors<any> | undefined, name: string): FieldError | undefined => {
	if (!errors)
		return undefined;

	if (name.includes('.')) {
		const [parent, child] = name.split('.');
		return errors[parent] && errors[parent][child];
	}

	return errors[name];
}

/**
 *
 * @param data
 * @param searched
 */
export const globalDeepSearch = <Data extends object>(data: Data[], searched: string | number) => {
	if (!searched) {
		return data;
	}

	const _searched = `${searched}`.toLowerCase();

	const doesMatch = (item: unknown): boolean => {
		if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
			return `${item}`.toLowerCase().includes(_searched);
		}

		if (Array.isArray(item)) {
			return item.some(doesMatch);
		}

		if (typeof item === 'object' && isNotSafeFalsy(item)) {
			return Object.values(item).some(doesMatch);
		}

		return false;
	}

	return data.filter(doesMatch);
};

type MapDataToQueryStringType = {
	data: object,
	url?: string,
	removeTrashValue?: boolean,
	transformToUrl?: boolean,
	transformToSnakeCase?: boolean,
};

export const mapDataToQueryString = ({ data, url = '', removeTrashValue = true, transformToUrl = false, transformToSnakeCase = true }: MapDataToQueryStringType): { params: object, url: string } => {
	let _url = url;
	const params = { ...data };

	if (removeTrashValue) {
		Object.entries(params).forEach(item => {
			if (item[1] === undefined
				|| item[1] === ''
				|| (Array.isArray(item[1]) && item[1].length === 0)) {
				// @ts-ignore
				delete params[item[0]];
			}
		});
	}

	if (transformToUrl) {
		Object.entries(params).forEach((item) => {
			if (Array.isArray(item[1])) {
				item[1].forEach(val => {
					// @ts-ignore
					const encoded = encodeURIComponent(val);
					const character = _url.includes('?') ? '&' : '?';
					const key = !transformToSnakeCase ? item[0] : toSnakeCase(item[0]);
					_url = `${_url}${character}${key}=${encoded}`;
				});
			} else {
				// @ts-ignore
				const encoded = encodeURIComponent(item[1]);
				const character = _url.includes('?') ? '&' : '?';
				const key = !transformToSnakeCase ? item[0] : toSnakeCase(item[0]);
				_url = `${_url}${character}${key}=${encoded}`;
			}
		});
	}

	return {
		params,
		url: _url
	}
}

export const scrollTo = (selectors: string) => {
	document.querySelector(selectors).scrollIntoView({
		behavior: 'smooth',
		block: 'center',
		inline: 'center'
	});
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param contentDisposition
 */
export const getFilenameFromContentDisposition = (contentDisposition: string): string | undefined => {
	const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	const matches = filenameRegex.exec(contentDisposition);
	let filename;
	if (matches != null && matches[1]) {
		filename = matches[1].replace(/['"]/g, '');
	}
	return filename;
}
