import { loadGamedata } from "./load";
import "./style.css";

async function init() {
	const json = await (await fetch("gamedata.json")).json();
	loadGamedata(json);
}

init();
