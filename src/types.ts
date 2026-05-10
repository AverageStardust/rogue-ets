export interface GameObject {
	GetTags(): Set<VerbTag>;
	toString(): string;
}

export interface Frontend {
	AppendStory(text: string, objects: GameObject[]): void;
	InvalidateObjects(): void;

	RegisterVerb(word: string, args: VerbTag[]): void;
	EnableVerb(word: string): void;
	DisableVerb(word: string): void;
	RegisterVerbHook(hook: (word: string, args: GameObject[]) => void): void;

	DisplayError(message: string): void;
	DisplayMessage(message: string): void;

	ResetState(): void;
}

export enum VerbTag {
	Location,
	Item,
}
