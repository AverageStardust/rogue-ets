import { LoadError } from "../load";

export abstract class Phrase {
	static tagEscapeRegex = /\\#/g;
	static tagRegex = /(?<!\\)#/;

	abstract toString(): string;

	static finalizeLoad(data: string) {
		if (Phrase.tagRegex.test(data)) {
			throw new LoadError("Unexpected tag");
		}

		return data.replaceAll(Phrase.tagEscapeRegex, "#");
	}
}
