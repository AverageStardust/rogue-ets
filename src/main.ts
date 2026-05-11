import { HTMLFrontend } from "./frontend.ts";
import { type Frontend } from "./types.ts";
import { loadGamedata } from "./load";

const frontend: Frontend = new HTMLFrontend();

async function init() {
	const json = await (await fetch("gamedata.json")).json();
	loadGamedata(json);
}

init();
