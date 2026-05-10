import { LoadError } from "./load";
import { validateLocationExists } from "./location";
import { VehicleType } from "./vehicleType";

const lines: Map<string, Line> = new Map();

export function loadLines(data: Record<string, any>) {
	lines.clear();

	for (const key in data) {
		const line = Line.load(data[key]);
		lines.set(key, line);
	}
}

export function validateLines() {
	for (const line of lines.values()) {
		line.validate();
	}
}

export function getLine(lineKey: string) {
	return lines.get(lineKey);
}

export function getLinesThroughLocation(locationKey: string): Line[] {
	const throughLines = [];
	for (const line of lines.values()) {
		if (line.stops.includes(locationKey)) {
			throughLines.push(line);
		}
	}

	return throughLines;
}

export class Line {
	vehicleType: VehicleType;
	stops: string[];
	trips: number[];

	static load(data: any) {
		const type = VehicleType.load(data["vehicleType"]);

		const stops: string[] = [];
		const trips: number[] = [];

		let expectingStop = true;
		for (const element of data["stops"]) {
			if (expectingStop) {
				if (typeof element !== "string")
					throw new LoadError(`Expecting stop but found ${element}`);

				stops.push(element);
				expectingStop = false;
			} else {
				if (typeof element !== "number")
					throw new LoadError(`Expecting trip but found ${element}`);

				trips.push(element);
				expectingStop = true;
			}
		}

		if (expectingStop) throw new LoadError(`Expected end of stops`);

		return new Line(type, stops, trips);
	}

	constructor(vehicleType: VehicleType, stops: string[], trips: number[]) {
		this.vehicleType = vehicleType;
		this.stops = stops;
		this.trips = trips;
	}

	validate() {
		for (const stop of this.stops) {
			validateLocationExists(stop);
		}
	}
}
