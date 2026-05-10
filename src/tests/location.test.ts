import { LoadError } from "../load";
import {
	getLocation,
	loadLocations,
	Location,
	validateLocationExists,
	validateLocations,
} from "../location";

test("load locations", () => {
	const location1 = Location.load({
		name: "Bay/Enterprise Square Station",
		paths: ["corona", "central", "102st"],
	});

	expect(location1.name).toBe("Bay/Enterprise Square Station");
	expect(location1.transitName).toBe("Bay/Enterprise Square");
	expect(location1.paths).toEqual(["corona", "central", "102st"]);

	const location2 = Location.load({
		name: "SUBmart",
		paths: ["university"],
	});

	expect(location2.name).toBe("SUBmart");
	expect(location2.transitName).toBe("SUBmart");
	expect(location2.paths).toEqual(["university"]);

	loadLocations({
		southgate: {
			name: "Southgate Station",
			paths: ["southgateMall"],
		},
		southgateMall: {
			name: "Southgate Mall",
			paths: ["southgate"],
		},
	});

	const location3 = getLocation("southgate");
	const location4 = getLocation("southgateMall");
	const location5 = getLocation("university");

	expect(location3).toBeDefined();
	expect(location4).toBeDefined();
	expect(location5).not.toBeDefined();

	expect(location3?.transitName).toBe("Southgate");
	expect(location4?.name).toBe("Southgate Mall");
});

test("validate", () => {
	expect(() => {
		loadLocations({
			southgate: {
				name: "Southgate Station",
				paths: ["southgateMall"],
			},
			southgateMall: {
				name: "Southgate Mall",
				paths: ["bayEnterprise"],
			},
		});

		validateLocations();
	}).toThrow(LoadError);

	expect(() => {
		loadLocations({
			southgate: {
				name: "Southgate Station",
				paths: ["southgateMall"],
			},
			southgateMall: {
				name: "Southgate Mall",
				paths: ["southgate"],
			},
		});

		validateLocations();
	}).not.toThrow();

	expect(() => {
		validateLocationExists("southgate");
		validateLocationExists("southgateMall");
	}).not.toThrow();

	expect(() => {
		validateLocationExists("subMart");
	}).toThrow();
});
