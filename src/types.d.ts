declare enum VerbTag {
	Location,
	Item,
}

declare interface GameObject {
	GetTags(): Set<VerbTag>;
	toString(): string;
}

declare interface Frontend {
	AppendStory(text: string, objects: GameObject[]);
	InvalidateObjects();

	RegisterVerb(word: string, arguments: VerbTag[]);
	EnableVerb(word: string);
	DisableVerb(word: string);
	RegisterVerbHook(hook: (word: string, arguments: GameObject[]) => void);

	DisplayError(message: string);
	DisplayMessage(message: string);

	ResetState();
}
