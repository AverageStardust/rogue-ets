import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "jsdom",

	extensionsToTreatAsEsm: [".ts"],

	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
};

export default config;
