import t from "tap";
import { calculate } from "./proseka-rating";

t.test("Proseka Rating Tests", (t) => {
	const LEVEL = 10; // example chart level

	// Test top-end scores
	t.equal(
		calculate(300, 0, 0, 0, 0, LEVEL, 300),
		LEVEL,
		"Perfect score should be chart constant (100%)."
	);

	t.equal(
		calculate(255, 45, 0, 0, 0, LEVEL, 300),
		LEVEL - 0.5,
		"95% (255P + 45G) should subtract 0.5 from chart constant."
	);

	t.equal(
		calculate(210, 90, 0, 0, 0, LEVEL, 300),
		LEVEL - 1,
		"90% (210P + 90G) should subtract 1 from chart constant."
	);

	t.equal(
		calculate(165, 135, 0, 0, 0, LEVEL, 300),
		LEVEL - 1.5,
		"85% (165P + 135G) should subtract 1.5 from chart constant."
	);

	t.equal(
		calculate(120, 180, 0, 0, 0, LEVEL, 300),
		LEVEL - 2,
		"80% (120P + 180G) should subtract 2 from chart constant."
	);

	t.equal(
		calculate(0, 150, 150, 0, 0, LEVEL, 300),
		0,
		"50% (150G + 150Go) should return 0 rating."
	);

	t.equal(calculate(0, 0, 0, 0, 300, LEVEL, 300), 0, "0% (300 misses) should return 0 rating.");

	// Test some intermediate values
	t.equal(calculate(285, 10, 5, 0, 0, LEVEL, 300), 9.77, "285P + 10G + 5Go = 97.78%");
	t.equal(calculate(200, 100, 0, 0, 0, LEVEL, 300), 8.88, "200P + 100G = 88.89%");

	t.end();
});

t.test("Proseka Rating Edge Cases", (t) => {
	// Chart level 0 should still work
	t.equal(
		calculate(300, 0, 0, 0, 0, 0, 300),
		0,
		"Perfect score on level 0 chart should return 0 rating (0*C)."
	);

	t.equal(calculate(0, 0, 0, 0, 300, 0, 300), 0, "0 score on level 0 chart should return 0.");

	t.end();
});

t.test("Proseka Rating Validation Tests", (t) => {
	// Negative inputs should throw
	t.throws(
		() => calculate(-1, 0, 0, 0, 0, 10, 100),
		/Perfect count cannot be negative/u,
		"Negative perfectCount should throw."
	);
	t.throws(
		() => calculate(101, 0, 0, 0, 0, 10, 100),
		/Score cannot be greater than maximum possible score/u,
		"Score exceeding maxCombo*3 should throw."
	);
	t.throws(
		() => calculate(0, 0, 0, 0, 0, -1, 300),
		/Chart level cannot be negative/u,
		"Negative chart level should throw."
	);

	t.end();
});
