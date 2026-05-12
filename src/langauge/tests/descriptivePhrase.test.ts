import { Adjective } from "../adjective";
import { DescriptivePhrase } from "../descriptivePhrase";
import { Noun } from "../noun";

test("discribe noun", () => {
	const car = Noun.load("car");
	const red = Adjective.load("red#c");

	const redCar = new DescriptivePhrase(car, [red]);
	expect(redCar.toString()).toBe("red car");
	expect(redCar.getDefinateAmount(2)).toBe("the two red cars");
});

test("adjective order", () => {
	const goose = Noun.load("goose#p'geese'");
	const annoying = Adjective.load("annoying#j");
	const canadian = Adjective.load("Canadian#o");
	const big = Adjective.load("big#s");

	const annoyingBigCanadianGoose = new DescriptivePhrase(goose, [
		big, // different order
		annoying,
		canadian,
	]);
	expect(annoyingBigCanadianGoose.toString()).toBe(
		"annoying big Canadian goose",
	);
	expect(annoyingBigCanadianGoose.getDefinateAmount(2)).toBe(
		"the two annoying big Canadian geese",
	);
});
