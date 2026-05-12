import { toNumeral } from "./toNumeral";
import { Phrase } from "./phrase";

export abstract class NounPhrase extends Phrase {
	protected alwaysDefinate: boolean;

	constructor(alwaysDefinate: boolean = false) {
		super();
		this.alwaysDefinate = alwaysDefinate;
	}

	getIndefinite(amount: number = 1): string {
		if (this.alwaysDefinate) return this.getDefinate();

		if (amount !== 1) return this.getIndefiniteAmount(amount);

		if (this.startsWithVowel()) {
			return `an ${this.toString()}`;
		} else {
			return `a ${this.toString()}`;
		}
	}

	protected startsWithVowel() {
		return "aeiou".includes(this.toString()[0]);
	}

	getDefinate(amount: number = 1): string {
		if (amount !== 1) return this.getDefinateAmount(amount);

		return `the ${this.toString()}`;
	}

	getIndefiniteAmount(amount: number): string {
		if (this.alwaysDefinate) return this.getDefinateAmount(amount);

		let content;
		if (amount === 1) {
			content = this.toString();
		} else {
			content = this.getPlural();
		}

		return toNumeral(amount) + " " + content;
	}

	getDefinateAmount(amount: number): string {
		let content;
		if (amount === 1) {
			content = this.toString();
		} else {
			content = this.getPlural();
		}

		return `the ${toNumeral(amount)} ${content}`;
	}

	getPlural(): string {
		const form = this.toString();

		let lastLetter = form[form.length - 1];
		let lastTwoLetters: string = "  ";
		if (form.length >= 2) {
			lastTwoLetters = form.substring(form.length - 2);
		}

		if (
			lastTwoLetters == "sh" ||
			lastTwoLetters == "ch" ||
			lastTwoLetters == "zz"
		) {
			return form + "es";
		} else if (lastLetter == "s" || lastLetter == "x") {
			return form + "es";
		} else if (
			lastTwoLetters[1] == "o" &&
			!"aeiou".includes(lastTwoLetters[0])
		) {
			return form + "es";
		} else if (lastLetter == "z") {
			return form + "zes";
		} else if (
			lastTwoLetters[1] == "y" &&
			!"aeiou".includes(lastTwoLetters[0])
		) {
			// consonant y
			return form.substring(0, form.length - 1) + "ies";
		} else if (lastTwoLetters == "fe") {
			return form.substring(0, form.length - 2) + "ves";
		} else if (lastLetter == "f") {
			return form.substring(0, form.length - 1) + "ves";
		} else {
			return form + "s";
		}
	}
}
