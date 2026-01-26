import t from "tap";
import { isAprx } from "../test-utils/approx";
import { TestCase } from "../test-utils/test-case";
import { ThrowsToSnapshot } from "../test-utils/throw-snapshot";
import { calculate, MaimaiDXLamps } from "./maimaidx-rate";

t.test("maimai DX Rate Tests", (t) => {
	function MakeTestCase(
		score: number,
		level: number,
		lamp: MaimaiDXLamps | undefined,
		expectedRate: number
	): TestCase {
		return (t) =>
			isAprx(
				t,
				calculate(score, level, lamp),
				expectedRate,
				`A score of ${score} on a chart of level ${level} with lamp ${lamp} should be worth ${expectedRate} rate.`
			);
	}

	const testCases = [
		// Assertions plucked from a random user's account
		MakeTestCase(100.1398, 13, "CLEAR", 281),
		MakeTestCase(100.1379, 12.7, "CLEAR", 274),
		MakeTestCase(100.227, 12.5, "CLEAR", 270),
		MakeTestCase(99.4936, 12.8, "CLEAR", 264),

		// General boundary checks
		MakeTestCase(100.5, 13, "ALL PERFECT", 293),
		MakeTestCase(100.5, 13, "CLEAR", 292),
		MakeTestCase(100.4999, 14, "CLEAR", 312),
		MakeTestCase(100, 13, "CLEAR", 280),
		MakeTestCase(99.9999, 13.7, "CLEAR", 293),
		MakeTestCase(99.5, 13.7, "CLEAR", 287),
		MakeTestCase(99, 12.7, "CLEAR", 261),
		MakeTestCase(98.9999, 12.9, "CLEAR", 263),
		MakeTestCase(98, 10, "CLEAR", 198),
		MakeTestCase(97, 8, "CLEAR", 155),
		MakeTestCase(96.9999, 10.7, "CLEAR", 182),
		MakeTestCase(94, 10.7, "CLEAR", 168),
		MakeTestCase(90, 5, "CLEAR", 68),
		MakeTestCase(80, 11.5, "CLEAR", 125),
		MakeTestCase(79.9999, 11.5, "FAILED", 117),
		MakeTestCase(75, 12.4, "FAILED", 111),
		MakeTestCase(70, 14.2, "FAILED", 111),
		MakeTestCase(60, 15, "FAILED", 86),
		MakeTestCase(50, 12.6, "FAILED", 50),
		MakeTestCase(40, 12.6, "FAILED", 32),
		MakeTestCase(30, 12.6, "FAILED", 18),
		MakeTestCase(20, 12.6, "FAILED", 8),
		MakeTestCase(10, 12.6, "FAILED", 2),
		MakeTestCase(0, 12.6, "FAILED", 0),

		// Ensuring that not providing a lamp still works
		MakeTestCase(101, 13, undefined, 292),
		MakeTestCase(100.5, 13, undefined, 292),
		MakeTestCase(75, 12.4, undefined, 111),
	];

	for (const testCase of testCases) {
		testCase(t);
	}

	// Other weird algorithm quirks.

	t.equal(
		calculate(100.5, 13, "ALL PERFECT"),
		calculate(101, 13, "ALL PERFECT+"),
		"101% and 100.5% should give identical rate on ALL PERFECT."
	);

	t.end();
});

t.test("maimai DX Rate Validation Tests", (t) => {
	ThrowsToSnapshot(t, () => calculate(-1, 10, "FAILED"), "Should throw if score is negative.");
	ThrowsToSnapshot(
		t,
		() => calculate(101.5, 10, "ALL PERFECT+"),
		"Should throw if score is greater than 101%."
	);
	ThrowsToSnapshot(t, () => calculate(99.5, -1, "CLEAR"), "Should throw if level is negative.");
	ThrowsToSnapshot(
		t,
		() => calculate(100.5, 10, "ALL PERFECT+"),
		"Should throw if lamp is ALL PERFECT+ but score is not 101%."
	);
	ThrowsToSnapshot(
		t,
		() => calculate(101, 10, "ALL PERFECT"),
		"Should throw if score is 101% but lamp is not ALL PERFECT+"
	);
	ThrowsToSnapshot(
		t,
		() => calculate(100.4, 10, "ALL PERFECT"),
		"Should throw if lamp is ALL PERFECT but score is below 100.5%."
	);

	t.end();
});
