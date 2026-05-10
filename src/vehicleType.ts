import { LoadError } from "./load";

export enum VehicleMode {
	Train,
	Bus,
}

export class VehicleType {
	mode: VehicleMode;
	isBidirectional: boolean;
	prefix: string;
	checkpoints: Map<string, string>;

	static load(data: any) {
		let mode: VehicleMode;
		switch (data["mode"]) {
			case "train":
				mode = VehicleMode.Train;
				break;
			case "bus":
				mode = VehicleMode.Bus;
				break;
			default:
				throw new LoadError(`Unknown vehicle type ${data}`);
		}

		const isBidirectional = data["bidirectional"] ?? false;

		const prefix = data["prefix"] ?? "";

		const checkpoints: Map<string, string> = new Map();
		for (const key in data["checkpoints"]) {
			const checkpointName = data["checkpoints"][key];
			checkpoints.set(key, checkpointName);
		}

		return new VehicleType(mode, isBidirectional, prefix, checkpoints);
	}

	constructor(
		mode: VehicleMode,
		isBidirectional: boolean,
		prefix: string,
		checkpoints: Map<string, string>,
	) {
		this.mode = mode;
		this.isBidirectional = isBidirectional;
		this.prefix = prefix;
		this.checkpoints = checkpoints;
	}
}
