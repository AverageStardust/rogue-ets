import { loadGamedata } from "../load";
import gamedata from "../../public/gamedata.json" with { type: "json" };

test("load gamedata", () => {
	expect(() => {
		loadGamedata(gamedata);
	}).not.toThrow();
});
