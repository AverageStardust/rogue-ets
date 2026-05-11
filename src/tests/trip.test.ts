import { LoadError } from "../load";
import { Trip } from "../trip";

test("load trip", () => {
	const trip1 = Trip.load(3);

	expect(trip1.turnsLong).toBe(3);
	expect(trip1.sight).toBeUndefined();

	const trip2 = Trip.load([12, "highLevelBridge"]);

	expect(trip2.turnsLong).toBe(12);
	expect(trip2.sight).toBe("highLevelBridge");
});

test("validate trip", () => {
	expect(() => {
		Trip.load([12]);
	}).toThrow(LoadError);

	expect(() => {
		Trip.load(["hello", "highLevelBridge"]);
	}).toThrow(LoadError);

	expect(() => {
		Trip.load("5");
	}).toThrow(LoadError);
});
