import { getRandomInt } from './funcHelper';

const colors = [
	"#CA054D",
	"#D282A6",
	"#FF6B6B",
	"#4ECDC4",
	"#242038",
	"#02111B",
	"#49306B",
	"#ace4aa",
	"#f44708",
	"#688e26",
];

const _guestOneColor = (function * __guestOneColor() {
	let usedId = [];
	while (true) {
		// eslint-disable-next-line func-names
		let index: any = (function(usedId, colors) {
			let i = getRandomInt(0, colors.length - 1);
			while (usedId.includes(i)) {
				i = getRandomInt(0, colors.length - 1)
			}
			return i;
		})(usedId, colors);
		usedId.push(index);

		if (usedId.length === colors.length) {
			usedId = [];
		}
		yield colors[index];
	}
})();

const guestOneColor = () => _guestOneColor.next().value;

export default guestOneColor;
