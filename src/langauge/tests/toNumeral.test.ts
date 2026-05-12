import { toNumeral } from "../toNumeral";

test("numerals", () => {
	expect(toNumeral(1)).toBe("one");
	expect(toNumeral(-4)).toBe("negative four");
	expect(toNumeral(14)).toBe("fourteen");
	expect(toNumeral(107)).toBe("one hundred seven");
	expect(toNumeral(140)).toBe("one hundred fourty");
	expect(toNumeral(2097)).toBe("two thousand ninety-seven");
});
