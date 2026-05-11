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
		this.html.addEventListener("click", this.clicked.bind(this));
	}

	private getEnabled(): boolean {
		return this.softEnabled && this.enabled;
	}

	private updateAttributes() {
		if (this.getEnabled()) {
			if (this.selected) {
				this.html.setAttribute("selectableState", "selected");
			} else {
				this.html.setAttribute("selectableState", "selectable");
			}
		} else {
			this.html.setAttribute("selectableState", "disabled");
		}
	}

	private clicked(_event: PointerEvent) {
		if (this.getEnabled()) {
			this.selected = !this.selected;
			this.clickHook(this, this.selected);
			this.updateAttributes();
		}
	}

	public getWord(): string {
		return this.word;
	}

	public appendTo(parent: HTMLDivElement) {
		parent.appendChild(this.html);
	}

	public deselect() {
		this.selected = false;
		this.updateAttributes();
	}

	public softEnable() {
		this.softEnabled = true;
		this.updateAttributes();
	}

	public softDisable() {
		this.softEnabled = false;
		this.updateAttributes();
	}

	public enable() {
		this.enabled = true;
		this.updateAttributes();
	}

	public disable() {
		this.enabled = false;
		this.updateAttributes();
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
		this.html.addEventListener("click", this.clicked.bind(this));
	}

	private updateAttributes() {
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

	private clicked(_event: PointerEvent) {
		if (this.selectable || this.selected) {
			this.selected = !this.selected;
			this.clickHook(this, this.selected);
			this.updateAttributes();
		}
	}

	public appendTo(parent: HTMLDivElement) {
		parent.appendChild(this.html);
	}

	public getGameObject(): GameObject {
		return this.object;
	}

	public setSelectable(tag: VerbTag) {
		this.selectable = this.object.getTags().has(tag);
		this.updateAttributes();
	}

	public stopSelection() {
		this.selectable = false;
		this.selected = false;
		this.updateAttributes();
	}

	public deselect() {
		this.selected = false;
		this.updateAttributes();
	}

	public disable() {
		this.selectable = false;
		this.selected = false;
		this.html.setAttribute("selectableState", "disabled");
	}
}

class Notification {
	private html: HTMLDivElement;
	private static TIMEOUT: number = 10000;

	constructor(
		message: string,
		private clickHook: (notification: Notification) => void,
		error: boolean = false,
	) {
		this.html = document.createElement("div");
		this.html.classList.add("notification");
		if (error) this.html.classList.add("error");
		this.html.textContent = message;
		this.html.addEventListener("click", this.clicked.bind(this));
		if (!error) {
			this.html.style.setProperty(
				"--transition-time",
				`${Notification.TIMEOUT}ms`,
			);
			setTimeout(
				() => this.html.style.setProperty("--overlay-percent", `100%`),
				100,
			);

			setTimeout(this.removeSelf.bind(this), Notification.TIMEOUT);
		}
	}

	private clicked(_event: PointerEvent) {
		this.removeSelf();
	}

	private removeSelf() {
		if (this.html.isConnected) {
			this.html.remove();
		}
		this.clickHook(this);
	}

	public appendTo(parent: HTMLDivElement) {
		parent.appendChild(this.html);
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
	private activeNouns: Map<GameObject, Noun> = new Map();

	private verbScreen: HTMLDivElement | null;
	private verbs: Verb[] = [];
	private verbSelection: VerbSelection | null = null;
	private verbHook: VerbHook | null = null;

	private notificationBox: HTMLDivElement | null;
	private notifications: Notification[] = [];

	constructor() {
		this.storyScreen = document.querySelector("div.story-screen");
		this.verbScreen = document.querySelector("div.verb-screen");
		this.notificationBox = document.querySelector("div.notification-box");
	}

	private accessVerb(word: string, accessor: (verb: Verb) => void) {
		const verb = this.getVerb(word);
		if (verb !== undefined) accessor(verb);
	}

	private getVerb(word: string): Verb | undefined {
		return this.verbs.find((verb) => verb.getWord() === word);
	}

	private initSelection(word: string, args: VerbTag[]) {
		this.verbSelection = {
			word,
			args,
			currentArgs: [],
			idx: 0,
		};

		this.finishOrUpdateSelection();
	}

	private nounClickedHook(noun: Noun, selected: boolean) {
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
						.forEach((otherNoun) => otherNoun.deselect());
					this.verbSelection.currentArgs.length = index;
				}
			}
			this.finishOrUpdateSelection();
		}
	}

	private finishOrUpdateSelection() {
		if (this.verbSelection !== null) {
			if (
				this.verbSelection.currentArgs.length <
				this.verbSelection.args.length
			) {
				// Update
				for (const noun of this.activeNouns.values()) {
					noun.setSelectable(
						this.verbSelection.args[this.verbSelection.idx],
					);
				}
			} else {
				// Finish
				if (this.verbHook !== null) {
					this.verbHook(
						this.verbSelection.word,
						this.verbSelection.currentArgs.map((noun) =>
							noun.getGameObject(),
						),
					);
				}
				this.clearSelection();
			}
		}
	}

	private clearSelection() {
		this.verbSelection = null;
		this.verbs.forEach((verb) => {
			verb.deselect();
			verb.softEnable();
		});
		for (const noun of this.activeNouns.values()) {
			noun.stopSelection();
		}
	}

	private verbClickedHook(verb: Verb, selected: boolean) {
		if (selected) {
			this.verbs
				.filter((otherVerb) => otherVerb !== verb)
				.forEach((otherVerb) => otherVerb.softDisable());
			this.initSelection(verb.getWord(), verb.args);
		} else {
			this.clearSelection();
		}
	}

	private removeNotification(notification: Notification) {
		this.notifications = this.notifications.filter(
			(notif) => notif != notification,
		);
	}

	private addActiveNoun(noun: Noun) {
		const oldNoun = this.activeNouns.get(noun.getGameObject());

		if (oldNoun != undefined) oldNoun.disable();

		this.activeNouns.set(noun.getGameObject(), noun);
	}

	public appendStory(text: string, objects: GameObject[]): void {
		const splitText = text.split("%o");
		const paragraph = document.createElement("p");
		paragraph.append(splitText.shift() ?? "");

		let missingObject = 0;
		const zipped = splitText.map((textSeg) => ({
			textSeg,
			object: objects.shift() ?? (missingObject++, "%o"),
		}));

		if (missingObject > 0) {
			this.displayError(
				`Appended story segment with ${missingObject} missing objects for interpolation`,
			);
		} else if (objects.length > 0) {
			this.displayError(
				`Appended story segment with ${objects.length} excess objects for interpolation`,
			);
		}

		if (this.storyScreen !== null) {
			this.storyScreen.append(paragraph);
		}

		for (const { textSeg, object } of zipped) {
			if (typeof object === "string") {
				paragraph.append(object, textSeg);
			} else {
				const noun = new Noun(object, this.nounClickedHook.bind(this));
				noun.appendTo(paragraph);
				this.addActiveNoun(noun);
				paragraph.append(textSeg);
			}
		}
	}

	public invalidateObjects(objects?: GameObject[]): void {
		if (objects == null) {
			objects = Array.from(this.activeNouns.keys());
		}

		for (const object of objects) {
			this.activeNouns.get(object)?.disable();
			this.activeNouns.delete(object);
		}
	}

	public registerVerb(word: string, args: VerbTag[]) {
		const verb = this.getVerb(word);
		if (verb !== undefined) {
			verb.args = args;
		} else {
			const newVerb = new Verb(
				word,
				args,
				this.verbClickedHook.bind(this),
			);
			this.verbs.push(newVerb);
			if (this.verbScreen !== null) {
				newVerb.appendTo(this.verbScreen);
			}
		}
	}

	public enableVerb(word: string) {
		this.accessVerb(word, (verb) => {
			verb.enable();
		});
	}

	public disableVerb(word: string) {
		this.accessVerb(word, (verb) => {
			verb.disable();
		});
	}

	public registerVerbHook(hook: VerbHook): void {
		this.verbHook = hook;
	}

	public displayError(message: string): void {
		const notification = new Notification(
			message,
			this.removeNotification.bind(this),
			true,
		);
		this.notifications.push(notification);
		if (this.notificationBox !== null) {
			notification.appendTo(this.notificationBox);
		}
	}

	public displayMessage(message: string): void {
		const notification = new Notification(
			message,
			this.removeNotification.bind(this),
		);
		this.notifications.push(notification);
		if (this.notificationBox !== null) {
			notification.appendTo(this.notificationBox);
		}
	}

	/**
	 * Resets all state **except** for the verb hook
	 */
	public resetState(): void {
		if (this.storyScreen !== null) {
			while (this.storyScreen.lastChild) {
				this.storyScreen.removeChild(this.storyScreen.lastChild);
			}
		}
		if (this.verbScreen !== null) {
			while (this.verbScreen.lastChild) {
				this.verbScreen.removeChild(this.verbScreen.lastChild);
			}
		}
		if (this.notificationBox !== null) {
			while (this.notificationBox.lastChild) {
				this.notificationBox.removeChild(
					this.notificationBox.lastChild,
				);
			}
		}
		this.activeNouns.clear();
		this.verbs = [];
		this.verbSelection = null;
		this.notifications = [];
	}
}
