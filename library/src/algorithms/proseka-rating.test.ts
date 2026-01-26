import t from "tap";
import { calculate } from "./proseka-rating";

const LEVEL = 30;
const MAX = 300;
const MAX_SCORE = MAX * 3;

function makeCounts(score: number) {
	const perfect = Math.floor(score / 3);
	const rem = score % 3;

	const great = rem === 2 ? 1 : 0;
	const good = rem === 1 ? 1 : 0;
	const bad = 0;
	const miss = MAX - perfect - great - good;

	return { perfect, great, good, bad, miss };
}

function expectedRating(percent: number) {
	if (percent >= 100) return LEVEL + 4;
	if (percent >= 99.5) return LEVEL + 3 + (percent - 99.5) / 0.5;
	if (percent >= 99) return LEVEL + 2 + (percent - 99) / 0.5;
	if (percent >= 98) return LEVEL + 1 + (percent - 98) / 1;
	if (percent >= 97) return LEVEL + (percent - 97) / 1;
	if (percent > 50) {
		const drop = 97 - percent;
		const ratingLoss = drop * (2 / 3);
		return Math.max(0, LEVEL - ratingLoss);
	}
	if (percent <= 50) return 0; else return -1;
}

t.test("Proseka Rating Tests", (t) => {
	const percents = [100, 99.5, 99, 98, 97, 50, 49];

	for (const p of percents) {
		const score = Math.round(MAX_SCORE * (p / 100));
		const counts = makeCounts(score);
		const percent = (score / MAX_SCORE) * 100;

		const expected = expectedRating(percent);
		const actual = calculate(
			counts.perfect,
			counts.great,
			counts.good,
			counts.bad,
			counts.miss,
			LEVEL,
			MAX
		);

		t.equal(actual, expected, `${p}% should match rating curve`);
	}

	t.end();
});

t.test("Bad == Miss Point Validation", (t) => {
	const a = calculate(295, 0, 0, 5, 0, LEVEL, MAX);
	const b = calculate(295, 0, 0, 0, 5, LEVEL, MAX);

	t.equal(a, b, "5 bads should equal 5 misses");
	t.end();
});
