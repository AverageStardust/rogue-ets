import { LoadError } from "../load";
import { Phrase } from "./phrase";

enum AdjectiveOrder {
	Opinion,
	Size,
	Quality,
	Shape,
	Age,
	Colour,
	Origin,
	Material,
	Type,
	Purpose,
}

export class Adjective extends Phrase {
	static orderRegexes = [
		/#j/, // judgment aka opinion
		/#s/,
		/#q/,
		/#s/,
		/#a/,
		/#c/,
		/#o/,
		/#m/,
		/#t/,
		/#p/,
	];

	private word: string;
	private order: AdjectiveOrder;

	static load(data: any) {
		if (typeof data !== "string") {
			throw new LoadError("Expected Adjective to be a string");
		}

		let order: AdjectiveOrder | undefined = undefined;

		for (let i = 0; i < Adjective.orderRegexes.length; i++) {
			const regex = Adjective.orderRegexes[i];
			if (regex.test(data)) {
				data = data.replace(regex, "");
				order = i;
				break;
			}
		}

		if (order == undefined) {
			throw new LoadError("Expected Adjective to be labled with order");
		}

		data = Phrase.finalizeLoad(data);

		return new Adjective(data, order);
	}

	static compare(a: Adjective, b: Adjective) {
		return a.order - b.order;
	}

	constructor(word: string, order: AdjectiveOrder) {
		super();
		this.word = word;
		this.order = order;
	}

	toString(): string {
		return this.word;
	}
}
