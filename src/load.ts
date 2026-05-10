import { loadLocations, validateLocations } from "./location";

export async function loadGamedata() {
	const json = await (await fetch("gamedata.json")).json();

	loadLocations(json["locations"]);

	validateLocations();
}

export class LoadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "LoadError";
		Object.setPrototypeOf(this, LoadError.prototype);
	}
}
