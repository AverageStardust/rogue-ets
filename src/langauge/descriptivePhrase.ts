import { Adjective } from "./adjective";
import type { Noun } from "./noun";
import { NounPhrase } from "./nounPhrase";

export class DescriptivePhrase extends NounPhrase {
	base: Noun;
	adjectives: Adjective[];

	constructor(base: Noun, adjectives: Adjective[]) {
		super();
		this.base = base;
		this.adjectives = [...adjectives]; // shallow copy so sort doesn't affect outer scope
		this.adjectives.sort(Adjective.compare); // sort for english adjective order
	}

	toString(): string {
		const discription = this.adjectives
			.map((adj) => adj.toString())
			.join(" ");
		return discription + " " + this.base.toString();
	}

	getPlural(): string {
		const discription = this.adjectives
			.map((adj) => adj.toString())
			.join(" ");
		return discription + " " + this.base.getPlural();
	}
}
