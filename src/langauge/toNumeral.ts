export function toNumeral(n: number): string {
	if (n < 0) {
		const positiveNumber = toNumeral(-n);
		return `negative ${positiveNumber}`;
	} else if (n < 20) {
		return [
			"zero",
			"one",
			"two",
			"three",
			"four",
			"five",
			"six",
			"seven",
			"eight",
			"nine",
			"ten",
			"eleven",
			"twelve",
			"thirteen",
			"fourteen",
			"fifteen",
			"sixteen",
			"seventeen",
			"eighteen",
			"nineteen",
		][n];
	} else if (n < 100) {
		const tens = [
			"twenty",
			"thirty",
			"fourty",
			"fifty",
			"sixty",
			"seventy",
			"eighty",
			"ninety",
		][Math.floor(n / 10) - 2];
		if (n % 10 === 0) {
			return tens;
		} else {
			const ones = toNumeral(n % 10);
			return `${tens}-${ones}`;
		}
	} else if (n < 1000) {
		const hundreds = `${toNumeral(Math.floor(n / 100))} hundred`;

		if (n % 100 === 0) {
			return hundreds;
		} else {
			const tensAndOnes = toNumeral(n % 100);
			return `${hundreds} ${tensAndOnes}`;
		}
	} else {
		const upperName = [
			"thousand",
			"million",
			"billion",
			"trillion",
			"quadrillion",
		][Math.floor(Math.log10(n) / 3) - 1];
		const upperSize = 1000 ** Math.floor(Math.log10(n) / 3);
		const upper = `${toNumeral(Math.floor(n / upperSize))} ${upperName}`;

		if (n % upperSize === 0) {
			return upper;
		} else {
			const lower = toNumeral(n % upperSize);
			return `${upper} ${lower}`;
		}
	}
}
