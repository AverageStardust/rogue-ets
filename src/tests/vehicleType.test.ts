import { LoadError } from "../load";
import { VehicleMode, VehicleType } from "../vehicleType";

test("load vehicle type", () => {
	const type1 = VehicleType.load({
		mode: "train",
		bidirectional: false,
		prefix: "express",
		checkpoints: {},
	});

	expect(type1.mode).toBe(VehicleMode.Train);
	expect(type1.isBidirectional).toBe(false);
	expect(type1.prefix).toBe("express");
	expect(type1.checkpoints.size).toEqual(0);

	const type2 = VehicleType.load({
		mode: "bus",
		bidirectional: true,
		prefix: "4",
		checkpoints: {
			wem: "Lewis Farms via WEM",
		},
	});

	expect(type2.mode).toBe(VehicleMode.Bus);
	expect(type2.isBidirectional).toBe(true);
	expect(type2.prefix).toBe("4");
	expect(type2.checkpoints.size).toEqual(1);
	expect(type2.checkpoints.get("wem")).toEqual("Lewis Farms via WEM");
});

test("validate vehicle type", () => {
	// check mode is valid
	expect(() => {
		VehicleType.load({
			mode: "car",
			bidirectional: true,
			prefix: "",
			checkpoints: {},
		});
	}).toThrow(LoadError);
});
