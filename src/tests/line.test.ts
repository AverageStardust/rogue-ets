import { Line } from "../line";
import { LoadError } from "../load";

test("load lines", () => {
	const line1 = Line.load({
		vehicleType: {
			mode: "train",
			isBidirectional: true,
			prefix: "",
			checkpoints: {},
		},
		stops: [
			"centuryPark",
			10,
			"southgate",
			6,
			"southCampus",
			4,
			"mcKernan",
		],
	});

	expect(line1.stops).toEqual([
		"centuryPark",
		"southgate",
		"southCampus",
		"mcKernan",
	]);
	expect(line1.trips).toEqual([10, 6, 4]);

	const line2 = Line.load({
		vehicleType: {
			mode: "bus",
			bidirectional: true,
			prefix: "",
			checkpoints: {},
		},
		stops: ["university", 6, "110st82ave", 7, "104st82ave"],
	});

	expect(line2.stops).toEqual(["university", "110st82ave", "104st82ave"]);
	expect(line2.trips).toEqual([6, 7]);
});

test("validate lines", () => {
	expect(() => {
		Line.load({
			vehicleType: {
				mode: "train",
				isBidirectional: true,
				prefix: "",
				checkpoints: {},
			},
			stops: ["centuryPark", 10, "southgate", 6, "southCampus", 4],
		});
	}).toThrow(LoadError);

	expect(() => {
		Line.load({
			vehicleType: {
				mode: "train",
				isBidirectional: true,
				prefix: "",
				checkpoints: {},
			},
			stops: [7, "centuryPark", 10, "southgate", 6, "southCampus"],
		});
	}).toThrow(LoadError);

	expect(() => {
		Line.load({
			vehicleType: {
				mode: "train",
				isBidirectional: true,
				prefix: "",
				checkpoints: {},
			},
			stops: [],
		});
	}).toThrow(LoadError);
});
