import { HTMLFrontend } from "./frontend.ts";
import { VerbTag, type Frontend } from "./types.ts";

const frontend: Frontend = new HTMLFrontend();

frontend.RegisterVerb("Examine", [VerbTag.Item]);
frontend.RegisterVerb("Move", [VerbTag.Location, VerbTag.Item, VerbTag.Item]);
frontend.RegisterVerb("Use", [VerbTag.Item]);

frontend.DisableVerb("Examine");

frontend.AppendStory("You can see %o here at %o, and also a test %o object", [
	{
		toString() {
			return "Object";
		},
		GetTags() {
			return new Set([VerbTag.Item]);
		},
	},
	{
		toString() {
			return "Location";
		},
		GetTags() {
			return new Set([VerbTag.Location]);
		},
	},
	{
		toString() {
			return "Location & Object";
		},
		GetTags() {
			return new Set([VerbTag.Location, VerbTag.Item]);
		},
	},
]);
