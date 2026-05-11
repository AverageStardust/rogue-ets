export enum VerbTag {
	Location,
	Item,
}

export interface GameObject {
	GetTags(): Set<VerbTag>;
	toString(): string;
}

export type VerbHook = (word: string, args: GameObject[]) => void;

export interface Frontend {
	AppendStory(text: string, objects: GameObject[]): void;
	InvalidateObjects(): void;

	RegisterVerb(word: string, args: VerbTag[]): void;
	EnableVerb(word: string): void;
	DisableVerb(word: string): void;
	RegisterVerbHook(hook: VerbHook): void;

	DisplayError(message: string): void;
	DisplayMessage(message: string): void;

	ResetState(): void;
}
