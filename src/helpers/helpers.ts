import { useCallback, useState } from "react";

export function test() {
	return null;
}

export function vigenere(message:string, cle:string, operation:string) {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	message = message.toUpperCase();
	cle = cle.toUpperCase();
	let key = "";
	for (let i = 0; i < message.length; i++) {
		key += cle.charAt(i % cle.length);
	}
	if (operation == "chiffrement") {
		let result = "";
		for (let i = 0; i < message.length; i++) {
			if (!alphabet.includes(message.charAt(i))) {
				result += message.charAt(i);
			} else {
				let index = (alphabet.indexOf(message.charAt(i)) + alphabet.indexOf(key.charAt(i))) % 26;
				result += alphabet.charAt(index);
			}
		}
		return result;
	} else if (operation == "dechiffrement") {
		let result = "";
		for (let i = 0; i < message.length; i++) {
			if (!alphabet.includes(message.charAt(i))) {
				result += message.charAt(i);
			} else {
				let index = (alphabet.indexOf(message.charAt(i)) - alphabet.indexOf(key.charAt(i)) + 26) % 26;
				result += alphabet.charAt(index);
			}
		}
		return result;
	} else {
		return "Opération invalide. Veuillez entrer 'chiffrement' ou 'dechiffrement'.";
	}
}

export const permut = (tab: any[], i: number, j: number) => {
	let c = tab[i];
	tab[i] = tab[j];
	tab[j] = c;
};

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

	// @ts-ignore
	document.documentElement.setAttribute('os', os);
	return os;
}

export const hasNotch = () => {
	/**
	 * For storybook test
	 */
	const storybook = window.location !== window.parent.location;
	// @ts-ignore
	const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
	const aspect = window.screen.width / window.screen.height;
	const aspectFrame = window.innerWidth / window.innerHeight;
	return (
		(iPhone && aspect.toFixed(3) === '0.462') ||
		(storybook && aspectFrame.toFixed(3) === '0.462')
	);
};

export const mergeRefs = (refs: any[]) => {
	return (value: any) => {
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

export const priceFormat = (price: number) => {
	return price.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});
};

export const average = (array: any[]) => array.reduce((a, b) => a + b) / array.length;

export const percent = (value1: number, value2: number) =>
	Number(((value1 / value2 - 1) * 100).toFixed(2));

export const getFirstLetter = (text: string, letterCount = 2): string =>
	// @ts-ignore
	text
		.toUpperCase()
		.match(/\b(\w)/g)
		.join('')
		.substring(0, letterCount);

export const debounce = (func: (arg0: any) => void, wait = 1000) => {
	let timeout: string | number | NodeJS.Timeout | undefined;

	return function executedFunction(...args: any[]) {
		const later = () => {
			clearTimeout(timeout);
			// @ts-ignore
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
	const [translate, setTranslate] = useState(defaultTranslate);
	const containerRef = useCallback((containerElem:any) => {
		if (containerElem !== null) {
			const { width, height } = containerElem.getBoundingClientRect();
			setTranslate({ x: width / 2, y: height / 5 });
		}
	}, []);
	return [translate, containerRef];
};
