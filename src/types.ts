export enum VerbTag {
	Location,
	Item,
}

export interface GameObject {
	getTags(): Set<VerbTag>;
	toString(): string;
}

export type VerbHook = (word: string, args: GameObject[]) => void;

export interface Frontend {
	appendStory(text: string, objects: GameObject[]): void;
	invalidateObjects(objects?: GameObject[]): void;

	registerVerb(word: string, args: VerbTag[]): void;
	enableVerb(word: string): void;
	disableVerb(word: string): void;
	registerVerbHook(hook: VerbHook): void;

	displayError(message: string): void;
	displayMessage(message: string): void;

	resetState(): void;
}
