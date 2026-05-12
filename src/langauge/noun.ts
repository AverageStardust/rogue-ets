import { LoadError } from "../load";
import { NounPhrase } from "./nounPhrase";
import { Phrase } from "./phrase";

interface NounOptions {
	alwaysDefinate?: boolean;
	startsWithVowel?: boolean;
	pluralOverride?: string;
}

export class Noun extends NounPhrase {
	static alwaysDefinateRegex = /#d/;
	static startsWithConsonantRegex = /#c/;
	static startsWithVowelRegex = /#v/;
	static pluralOverrideRegex = /#p("[^"]+"|'[^'"]+')/;

	private word: string;
	private pluralOverride?: string;
	private startsWithVowelOverride?: boolean;

	static load(data: any) {
		if (typeof data !== "string") {
			throw new LoadError("Expected Noun to be a string");
		}

		let options: NounOptions = {};

		if (Noun.alwaysDefinateRegex.test(data)) {
			data = data.replace(Noun.alwaysDefinateRegex, "");
			options.alwaysDefinate = true;
		}

		if (Noun.startsWithConsonantRegex.test(data)) {
			data = data.replace(Noun.startsWithConsonantRegex, "");
			options.startsWithVowel = false;
		}

		if (Noun.startsWithVowelRegex.test(data)) {
			data = data.replace(Noun.startsWithVowelRegex, "");
			options.startsWithVowel = true;
		}

		const match = (Noun.pluralOverrideRegex.exec(data) ?? [])[0];
		if (match != undefined) {
			data = data.replace(match, "");
			options.pluralOverride = match.substring(3, match.length - 1);
		}

		data = Phrase.finalizeLoad(data);

		return new Noun(data, options);
	}

	constructor(word: string, options: NounOptions = {}) {
		super(options.alwaysDefinate);

		this.word = word;
		this.pluralOverride = options.pluralOverride;
		this.startsWithVowelOverride = options.startsWithVowel;
	}

	toString(): string {
		return this.word;
	}

	protected startsWithVowel() {
		if (this.startsWithVowelOverride != undefined) {
			return this.startsWithVowelOverride;
		} else {
			return super.startsWithVowel();
		}
	}

	getPlural(): string {
		const override = this.pluralOverride;
		if (override != null) return override;

		return super.getPlural();
	}
}
