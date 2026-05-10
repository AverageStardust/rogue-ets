import { LoadError } from "./load";

const locations: Map<string, Location> = new Map();

export function loadLocations(data: Record<string, any>) {
	locations.clear();

	for (const key in data) {
		const location = Location.load(data[key]);
		locations.set(key, location);
	}
}

export function validateLocations() {
	for (const location of locations.values()) {
		location.validate();
	}
}

export function validateLocationExists(locationKey: string) {
	if (!locations.has(locationKey)) {
		throw new LoadError(`Location ${locationKey} is not defined`);
	}
}

export function getLocation(locationKey: string) {
	return locations.get(locationKey);
}

export class Location {
	name: string;
	transitName: string; // shorter name excluding "Station" or "Stop" at the end
	paths: string[]; // walking paths to other locations

	static load(data: any) {
		return new Location(data.name, data.paths);
	}

	constructor(name: string, paths: string[]) {
		this.name = name;
		this.transitName = name.replace(/ (Station|Stop|Transit Centre)$/, "");
		this.paths = paths;
	}

	validate() {
		for (const path of this.paths) {
			validateLocationExists(path);
		}
	}
}
