import "./style.css";

import {
	VerbTag,
	type Frontend,
	type GameObject,
	type VerbHook,
} from "./types.ts";

type ClickHook<T> = (verb: T, selected: boolean) => void;

class Verb {
	private html: HTMLSpanElement;
	private softEnabled: boolean = true;
	private enabled: boolean = true;
	private selected: boolean = false;

	constructor(
		private word: string,
		public args: VerbTag[],
		private clickHook: ClickHook<Verb>,
	) {
		this.html = document.createElement("span");
		this.html.classList.add("btn");
		this.html.setAttribute("selectableState", "selectable");
		this.html.textContent = word;
		this.html.addEventListener("click", this.Clicked.bind(this));
	}

	private GetEnabled(): boolean {
		return this.softEnabled && this.enabled;
	}

	private UpdateAttributes() {
		if (this.GetEnabled()) {
			if (this.selected) {
				this.html.setAttribute("selectableState", "selected");
			} else {
				this.html.setAttribute("selectableState", "selectable");
			}
		} else {
			this.html.setAttribute("selectableState", "disabled");
		}
	}

	private Clicked(_event: PointerEvent) {
		if (this.GetEnabled()) {
			this.selected = !this.selected;
			this.clickHook(this, this.selected);
			this.UpdateAttributes();
		}
	}

	public GetWord(): string {
		return this.word;
	}

	public AppendTo(parent: HTMLDivElement) {
		parent.appendChild(this.html);
	}

	public Deselect() {
		this.selected = false;
		this.UpdateAttributes();
	}

	public SoftEnable() {
		this.softEnabled = true;
		this.UpdateAttributes();
	}

	public SoftDisable() {
		this.softEnabled = false;
		this.UpdateAttributes();
	}

	public Enable() {
		this.enabled = true;
		this.UpdateAttributes();
	}

	public Disable() {
		this.enabled = false;
		this.UpdateAttributes();
	}
}

class Noun {
	private html: HTMLSpanElement;
	private selectable: boolean = false;
	private selected: boolean = false;

	constructor(
		private object: GameObject,
		private clickHook: ClickHook<Noun>,
	) {
		this.html = document.createElement("span");
		this.html.classList.add("btn");
		this.html.textContent = object.toString();
		this.html.addEventListener("click", this.Clicked.bind(this));
	}

	private UpdateAttributes() {
		if (this.selected) {
			this.html.setAttribute("selectableState", "selected");
		} else {
			if (this.selectable) {
				this.html.setAttribute("selectableState", "selectable");
			} else {
				this.html.removeAttribute("selectableState");
			}
		}
	}

	private Clicked(_event: PointerEvent) {
		if (this.selectable || this.selected) {
			this.selected = !this.selected;
			this.clickHook(this, this.selected);
			this.UpdateAttributes();
		}
	}

	public AppendTo(parent: HTMLDivElement) {
		parent.appendChild(this.html);
	}

	public GetGameObject(): GameObject {
		return this.object;
	}

	public SetSelectable(tag: VerbTag) {
		this.selectable = this.object.GetTags().has(tag);
		this.UpdateAttributes();
	}

	public StopSelection() {
		this.selectable = false;
		this.selected = false;
		this.UpdateAttributes();
	}

	public Deselect() {
		this.selected = false;
		this.UpdateAttributes();
	}

	public Disable() {
		this.selectable = false;
		this.selected = false;
		this.html.setAttribute("selectableState", "disabled");
	}
}

interface VerbSelection {
	word: string;
	args: VerbTag[];
	currentArgs: Noun[];
	idx: number;
}

export class HTMLFrontend implements Frontend {
	private storyScreen: HTMLDivElement | null;
	private activeNouns: Noun[] = [];

	private verbs: Verb[] = [];
	private verbScreen: HTMLDivElement | null;
	private verbSelection: VerbSelection | null = null;
	private verbHook: VerbHook | null = null;

	constructor() {
		this.storyScreen = document.querySelector("div.story-screen");
		this.verbScreen = document.querySelector("div.verb-screen");
	}

	private AccessVerb(word: string, accessor: (verb: Verb) => void) {
		const verb = this.GetVerb(word);
		if (verb !== undefined) accessor(verb);
	}

	private GetVerb(word: string): Verb | undefined {
		return this.verbs.find((verb) => verb.GetWord() === word);
	}

	private InitSelection(word: string, args: VerbTag[]) {
		this.verbSelection = {
			word,
			args,
			currentArgs: [],
			idx: 0,
		};

		this.FinishOrUpdateSelection();
	}

	private NounClickedHook(noun: Noun, selected: boolean) {
		if (this.verbSelection !== null) {
			if (selected) {
				this.verbSelection.currentArgs.push(noun);
				this.verbSelection.idx++;
			} else {
				const index = this.verbSelection.currentArgs.indexOf(noun);
				if (index !== -1) {
					this.verbSelection.idx = index;
					this.verbSelection.currentArgs
						.slice(index)
						.forEach((otherNoun) => otherNoun.Deselect());
					this.verbSelection.currentArgs.length = index;
				}
			}
			this.FinishOrUpdateSelection();
		}
	}

	private FinishOrUpdateSelection() {
		if (this.verbSelection !== null) {
			if (
				this.verbSelection.currentArgs.length < this.verbSelection.args.length
			) {
				// Update
				for (const noun of this.activeNouns) {
					noun.SetSelectable(this.verbSelection.args[this.verbSelection.idx]);
				}
			} else {
				// Finish
				if (this.verbHook !== null) {
					this.verbHook(
						this.verbSelection.word,
						this.verbSelection.currentArgs.map((noun) => noun.GetGameObject()),
					);
				}
				this.ClearSelection();
			}
		}
	}

	private ClearSelection() {
		this.verbSelection = null;
		this.verbs.forEach((verb) => {
			verb.Deselect();
			verb.SoftEnable();
		});
		for (const noun of this.activeNouns) {
			noun.StopSelection();
		}
	}

	private VerbClickedHook(verb: Verb, selected: boolean) {
		if (selected) {
			this.verbs
				.filter((otherVerb) => otherVerb !== verb)
				.forEach((otherVerb) => otherVerb.SoftDisable());
			this.InitSelection(verb.GetWord(), verb.args);
		} else {
			this.ClearSelection();
		}
	}

	public AppendStory(text: string, objects: GameObject[]): void {
		const splitText = text.split("%o");
		const paragraph = document.createElement("p");
		paragraph.append(splitText.shift() ?? "");
		let missingObject = 0;
		const zipped = splitText.map((textSeg) => ({
			textSeg,
			object: objects.shift() ?? (missingObject++, "%o"),
		}));
		if (missingObject > 0) {
			console.warn(
				`Appended story segment with ${missingObject} missing objects for interpolation`,
			);
		} else if (objects.length > 0) {
			console.warn(
				`Appended story segment with ${objects.length} excess objects for interpolation`,
				objects,
			);
		}

		if (this.storyScreen !== null) {
			this.storyScreen.append(paragraph);
		}

		for (const { textSeg, object } of zipped) {
			if (typeof object === "string") {
				paragraph.append(object, textSeg);
			} else {
				const noun = new Noun(object, this.NounClickedHook.bind(this));
				noun.AppendTo(paragraph);
				this.activeNouns.push(noun);
				paragraph.append(textSeg);
			}
		}
	}

	public InvalidateObjects(): void {
		for (const noun of this.activeNouns) {
			noun.Disable();
		}
		this.activeNouns = [];
	}

	public RegisterVerb(word: string, args: VerbTag[]) {
		const verb = this.GetVerb(word);
		if (verb !== undefined) {
			verb.args = args;
		} else {
			const newVerb = new Verb(word, args, this.VerbClickedHook.bind(this));
			this.verbs.push(newVerb);
			if (this.verbScreen !== null) {
				newVerb.AppendTo(this.verbScreen);
			}
		}
	}

	public EnableVerb(word: string) {
		this.AccessVerb(word, (verb) => {
			verb.Enable();
		});
	}

	public DisableVerb(word: string) {
		this.AccessVerb(word, (verb) => {
			verb.Disable();
		});
	}

	public RegisterVerbHook(hook: VerbHook): void {
		this.verbHook = hook;
	}

	public DisplayError(message: string): void {}

	public DisplayMessage(message: string): void {}

	public ResetState(): void {}
}
