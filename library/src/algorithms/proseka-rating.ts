import { ThrowIf } from "../util/throw-if";

/**
 * Calculates the rating for a proseka score using the 39S rating system.
 * Judgement weights: Perfect = 3, Great = 2, Good = 1, Bad = 0, Miss = 0
 *
 * @param perfectCount - The number of perfects the user got. Worth 3 points each.
 * @param greatCount - The number of greats the user got. Worth 2 points each.
 * @param goodCount - The number of goods the user got. Worth 1 point each.
 * @param badCount - The number of bads the user got. Worth 0 points.
 * @param missCount - The number of misses the user got. Worth 0 points.
 * @param internalChartLevel - The internal chart level (constant).
 * @param maxCombo - The maximum combo achievable on the chart.
 */
export function calculate(
	perfectCount: number,
	greatCount: number,
	goodCount: number,
	badCount: number,
	missCount: number,
	internalChartLevel: number,
	maxCombo: number
) {
	// Validate inputs
	ThrowIf.negative(perfectCount, "Perfect count cannot be negative.", { perfectCount });
	ThrowIf.negative(greatCount, "Great count cannot be negative.", { greatCount });
	ThrowIf.negative(goodCount, "Good count cannot be negative.", { goodCount });
	ThrowIf.negative(badCount, "Bad count cannot be negative.", { badCount });
	ThrowIf.negative(missCount, "Miss count cannot be negative.", { missCount });
	ThrowIf.negative(maxCombo, "Max combo cannot be negative.", { maxCombo });
	ThrowIf.negative(internalChartLevel, "Chart level cannot be negative.", { internalChartLevel });

	const rawScore = perfectCount * 3 + greatCount * 2 + goodCount;
	const maxScore = maxCombo * 3;

	ThrowIf(rawScore > maxScore, "Score cannot be greater than maximum possible score.", {
		rawScore,
		maxScore,
	});

	const percent = (rawScore / maxScore) * 100;

	// 39S Rating System (Linear):
	// 100%   -> constant + 4
	// 99.5%  -> constant + 3
	// 99%    -> constant + 2
	// 98%    -> constant + 1
	// 97%    -> constant + 0
	// Every -3% below 97% is -2 rating (linear)
	// 50% always equals 0

	let rating: number = 0;

	if (percent >= 100) {
		rating = internalChartLevel + 4;
	} else if (percent >= 99.5) {
		// Linear from +3 to +4 over 0.5%
		rating = internalChartLevel + 3 + ((percent - 99.5) / 0.5) * 1;
	} else if (percent >= 99) {
		// Linear from +2 to +3 over 0.5%
		rating = internalChartLevel + 2 + ((percent - 99) / 0.5) * 1;
	} else if (percent >= 98) {
		// Linear from +1 to +2 over 1%
		rating = internalChartLevel + 1 + ((percent - 98) / 1) * 1;
	} else if (percent >= 97) {
		// Linear from 0 to +1 over 1%
		rating = internalChartLevel + ((percent - 97) / 1) * 1;
	} else if (percent > 50) {
		// Every -3% below 97% is -2 rating
		rating = internalChartLevel - (97 - percent) * (2 / 3);
		// Force to 0 if negative
		rating = Math.max(0, rating);
	} else {
		rating = 0;
	}

	return Math.max(rating, 0);
}
