import t from "tap";
import { isAprx } from "../test-utils/approx";
import { TestCase } from "../test-utils/test-case";
import { ThrowsToSnapshot } from "../test-utils/throw-snapshot";
import { integer } from "../util/types";
import { calculate, calculatePlus, inverse, inversePlus } from "./wacca-rate";

t.test("WACCA Rate Tests", (t) => {
	function MakeTestCase(score: integer, level: number, expectedRate: number): TestCase {
		return (t) =>
			isAprx(
				t,
				calculate(score, level),
				expectedRate,
				`A score of ${score} on a chart of level ${level} should be worth ${expectedRate} rate.`
			);
	}

	const testCases = [
		// Assertions plucked from a random user's account
		MakeTestCase(990_084, 13.2, 52.8),
		MakeTestCase(984_040, 12.9, 48.375),
		MakeTestCase(950_326, 12.2, 36.6),
		MakeTestCase(997_719, 4, 16),
		MakeTestCase(906_440, 13.8, 27.6),

		// General boundary checks
		MakeTestCase(990_000, 10.2, 40.8),
		MakeTestCase(980_000, 10.7, 40.125),
		MakeTestCase(960_000, 9, 29.25),
		MakeTestCase(950_000, 8, 24),
		MakeTestCase(940_000, 8, 22),
		MakeTestCase(920_000, 8, 20),
		MakeTestCase(900_000, 8, 16),
		MakeTestCase(850_000, 8, 12),
		MakeTestCase(500, 10, 10),
		MakeTestCase(0, 10, 10),
		MakeTestCase(849_999, 10, 10),
	];

	for (const testCase of testCases) {
		testCase(t);
	}

	// Other weird algorithm quirks.

	t.equal(
		calculate(975_000, 10),
		calculate(970_000, 10),
		"970K and 975K should give identical rates."
	);

	t.equal(
		calculate(1_000_000, 10),
		calculate(990_000, 10),
		"990K and 1m should give identical rates."
	);

	t.end();
});

t.test("WACCA Plus Rate Tests", (t) => {
	function MakeTestCase(score: integer, level: number, expectedRate: number): TestCase {
		return (t) =>
			isAprx(
				t,
				calculatePlus(score, level),
				expectedRate,
				`A score of ${score} on a chart of level ${level} should be worth ${expectedRate} rate.`
			);
	}

	const testCases = [
		// Assertions plucked from a random user's account
		MakeTestCase(997_719, 4, 16.2),
		MakeTestCase(993_779, 13.2, 53.196),
		MakeTestCase(985_040, 12.9, 49.9875),
		MakeTestCase(968_374, 13.6, 45.9),
		MakeTestCase(950_326, 12.2, 36.6),
		MakeTestCase(906_440, 13.8, 27.6),

		// General boundary checks
		MakeTestCase(995_000, 10.2, 41.31),
		MakeTestCase(994_000, 10.2, 41.208),
		MakeTestCase(993_000, 10.2, 41.106),
		MakeTestCase(992_000, 10.2, 41.004),
		MakeTestCase(991_000, 10.2, 40.902),
		MakeTestCase(990_000, 10.2, 40.8),
		MakeTestCase(985_000, 10.7, 41.4625),
		MakeTestCase(980_000, 10.7, 40.125),
		MakeTestCase(960_000, 9, 29.25),
		MakeTestCase(955_000, 8, 25),
		MakeTestCase(950_000, 8, 24),
		MakeTestCase(940_000, 8, 22),
		MakeTestCase(920_000, 8, 20),
		MakeTestCase(900_000, 8, 16),
		MakeTestCase(850_000, 8, 12),
		MakeTestCase(849_999, 10, 10),
		MakeTestCase(500, 10, 10),
		MakeTestCase(0, 10, 10),
	];

	for (const testCase of testCases) {
		testCase(t);
	}

	// Other weird algorithm quirks.

	t.not(
		calculatePlus(975_000, 10),
		calculatePlus(970_000, 10),
		"970K and 975K should NOT give identical rates."
	);

	t.not(
		calculatePlus(1_000_000, 10),
		calculatePlus(990_000, 10),
		"990K and 1m should NOT give identical rates."
	);

	t.end();
});

t.test("WACCA Rate Validation Tests", (t) => {
	ThrowsToSnapshot(t, () => calculate(-1, 10), "Should throw if score is negative.");
	ThrowsToSnapshot(
		t,
		() => calculate(1_000_001, 10),
		"Should throw if score is greater than 1million."
	);
	ThrowsToSnapshot(t, () => calculate(900_000, -1), "Should throw if level is negative.");
	ThrowsToSnapshot(t, () => calculatePlus(-1, 10), "Should throw if score is negative.");
	ThrowsToSnapshot(
		t,
		() => calculatePlus(1_000_001, 10),
		"Should throw if score is greater than 1million."
	);
	ThrowsToSnapshot(t, () => calculatePlus(900_000, -1), "Should throw if level is negative.");

	t.end();
});

t.test("WACCA Inverse Rate Tests", (t) => {
	function MakeTestCase(expectedScore: integer, level: number, rate: number): TestCase {
		return (t) =>
			isAprx(
				t,
				inverse(rate, level),
				expectedScore,
				`A rate of ${rate} on a chart of level ${level} should invert to ${expectedScore} rate.`
			);
	}

	// Assertions all copied from the previous tests, and just applied in reverse.
	// (and floored to the nearest boundary, because that's how it works.)
	const testCases = [
		MakeTestCase(990_000, 13.2, 52.8),
		MakeTestCase(980_000, 12.9, 48.375),
		MakeTestCase(950_000, 12.2, 36.6),
		MakeTestCase(970_000, 12.2, 40),
		MakeTestCase(990_000, 4, 16),
		MakeTestCase(900_000, 13.8, 27.6),
		MakeTestCase(990_000, 10.2, 40.8),
		MakeTestCase(980_000, 10.7, 40.125),
		MakeTestCase(960_000, 9, 29.25),
		MakeTestCase(950_000, 8, 24),
		MakeTestCase(940_000, 8, 22),
		MakeTestCase(920_000, 8, 20),
		MakeTestCase(900_000, 8, 16),
		MakeTestCase(850_000, 8, 12),
		MakeTestCase(0, 10, 10),
	];

	for (const testCase of testCases) {
		testCase(t);
	}

	t.end();
});

t.test("WACCA Plus Inverse Rate Tests", (t) => {
	function MakeTestCase(expectedScore: integer, level: number, rate: number): TestCase {
		return (t) =>
			isAprx(
				t,
				inversePlus(rate, level),
				expectedScore,
				`A rate of ${rate} on a chart of level ${level} should invert to ${expectedScore} rate.`
			);
	}

	// Assertions all copied from the previous tests, and just applied in reverse.
	// (and floored to the nearest boundary, because that's how it works.)
	const testCases = [
		MakeTestCase(995_000, 4, 16.2),
		MakeTestCase(994_000, 4, 16.16),
		MakeTestCase(993_000, 4, 16.12),
		MakeTestCase(993_000, 13.2, 53.196),
		MakeTestCase(992_000, 4, 16.08),
		MakeTestCase(991_000, 4, 16.04),
		MakeTestCase(990_000, 4, 16),
		MakeTestCase(990_000, 13.2, 52.8),
		MakeTestCase(990_000, 10.2, 40.8),
		MakeTestCase(985_000, 12.9, 49.9875),
		MakeTestCase(985_000, 10.7, 41.4625),
		MakeTestCase(980_000, 12.9, 48.375),
		MakeTestCase(980_000, 10.7, 40.125),
		MakeTestCase(975_000, 8, 28.5),
		MakeTestCase(970_000, 8, 27.5),
		MakeTestCase(965_000, 13.6, 45.9),
		MakeTestCase(965_000, 12.2, 40),
		MakeTestCase(960_000, 9, 29.25),
		MakeTestCase(955_000, 8, 25),
		MakeTestCase(950_000, 8, 24),
		MakeTestCase(950_000, 12.2, 36.6),
		MakeTestCase(950_000, 12.2, 36.6),
		MakeTestCase(940_000, 8, 22),
		MakeTestCase(920_000, 8, 20),
		MakeTestCase(900_000, 8, 16),
		MakeTestCase(900_000, 13.8, 27.6),
		MakeTestCase(900_000, 13.8, 27.6),
		MakeTestCase(850_000, 8, 12),
		MakeTestCase(0, 10, 10),
	];

	for (const testCase of testCases) {
		testCase(t);
	}

	t.end();
});

t.test("WACCA Inverse Rate Validation Tests", (t) => {
	ThrowsToSnapshot(t, () => inverse(50, -1), "Should throw if level is negative.");
	ThrowsToSnapshot(t, () => inversePlus(50, -1), "Should throw if level is negative.");
	ThrowsToSnapshot(t, () => inverse(100, 1), "Should throw if rate is impossible.");
	ThrowsToSnapshot(t, () => inversePlus(100, 1), "Should throw if rate is impossible.");

	t.end();
});
