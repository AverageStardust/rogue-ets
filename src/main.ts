import { loadGamedata } from "./load";
import "./style.css";

async function init() {
	await loadGamedata();
}

init();
