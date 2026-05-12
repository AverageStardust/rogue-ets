import { Noun } from "../noun";

test("plural nouns", () => {
	const car = Noun.load("car");
	expect(car.getPlural()).toBe("cars");

	const wish = Noun.load("wish");
	expect(wish.getPlural()).toBe("wishes");

	const quiz = Noun.load("quiz");
	expect(quiz.getPlural()).toBe("quizzes");

	const fox = Noun.load("fox");
	expect(fox.getPlural()).toBe("foxes");

	const half = Noun.load("half");
	expect(half.getPlural()).toBe("halves");

	const boy = Noun.load("boy");
	expect(boy.getPlural()).toBe("boys");

	const lady = Noun.load("lady");
	expect(lady.getPlural()).toBe("ladies");

	const leaf = Noun.load("leaf");
	expect(leaf.getPlural()).toBe("leaves");

	const wife = Noun.load("wife");
	expect(wife.getPlural()).toBe("wives");

	const echo = Noun.load("echo");
	expect(echo.getPlural()).toBe("echoes");

	const zoo = Noun.load("zoo");
	expect(zoo.getPlural()).toBe("zoos");

	const foot = Noun.load("foot#p'feet'");
	expect(foot.toString()).toBe("foot");
	expect(foot.getPlural()).toBe("feet");

	const moose = Noun.load("moose#p'moose'");
	expect(moose.toString()).toBe("moose");
	expect(moose.getPlural()).toBe("moose");
});

test("noun forms", () => {
	const baby = Noun.load("baby");

	expect(baby.getIndefinite()).toBe("a baby");
	expect(baby.getDefinate()).toBe("the baby");

	expect(baby.getIndefinite(1)).toBe("a baby");
	expect(baby.getDefinate(1)).toBe("the baby");

	expect(baby.getIndefinite(3)).toBe("three babies");
	expect(baby.getDefinate(3)).toBe("the three babies");

	expect(baby.getIndefiniteAmount(1)).toBe("one baby");
	expect(baby.getDefinateAmount(1)).toBe("the one baby");

	expect(baby.getIndefiniteAmount(3)).toBe("three babies");
	expect(baby.getDefinateAmount(3)).toBe("the three babies");
});

test("a vs an noun", () => {
	const apple = Noun.load("apple");
	expect(apple.getIndefinite()).toBe("an apple");

	const tree = Noun.load("tree");
	expect(tree.getIndefinite()).toBe("a tree");

	const hour = Noun.load("hour#v");
	expect(hour.getIndefinite()).toBe("an hour");

	const university = Noun.load("university#c");
	expect(university.getIndefinite()).toBe("a university");
});

test("always definate nouns", () => {
	const iss = Noun.load("Internation Space Station#d");
	expect(iss.getIndefinite()).toBe("the Internation Space Station");
});
