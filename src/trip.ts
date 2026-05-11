import { LoadError } from "./load";

export class Trip {
	turnsLong: number;
	sight?: string;

	static load(data: any): Trip {
		if (typeof data == "number") {
			return new Trip(data, undefined);
		} else if (
			Array.isArray(data) &&
			data.length == 2 &&
			typeof data[0] == "number" &&
			typeof data[1] == "string"
		) {
			return new Trip(data[0], data[1]);
		} else {
			throw new LoadError(`Expected trip but found ${data}`);
		}
	}

	constructor(turnsLong: number, sight?: string) {
		this.turnsLong = turnsLong;
		this.sight = sight;
	}
}
