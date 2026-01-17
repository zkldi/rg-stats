import { ThrowIf } from "../util/throw-if";

/**
 * Calculates the rating for a proseka score.
 * System developed by coul, not officially by SEGA.
 * Judgement weights are accurate to ranked match standards, with the exception of bad counts being worth 0.5 points instead of 0.
 *
 * @param perfectCount - The number of perfects the user got. Worth 3 points each.
 * @param greatCount - The number of greats the user got. Worth 2 points each.
 * @param goodCount - The number of goods the user got. Worth 1 point each.
 * @param badCount - The number of bads the user got. Worth 0.5 points each.
 * @param missCount - The number of misses the user got. Worth 0 points.
 * @param internalChartLevel - The internal chart level.
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
	// Validate inputs first
	ThrowIf.negative(perfectCount, "Perfect count cannot be negative.", { perfectCount });
	ThrowIf.negative(greatCount, "Great count cannot be negative.", { greatCount });
	ThrowIf.negative(goodCount, "Good count cannot be negative.", { goodCount });
	ThrowIf.negative(badCount, "Bad count cannot be negative.", { badCount });
	ThrowIf.negative(missCount, "Miss count cannot be negative.", { missCount });
	ThrowIf.negative(maxCombo, "Max combo cannot be negative.", { maxCombo });
	ThrowIf.negative(internalChartLevel, "Chart level cannot be negative.", { internalChartLevel });

	const levelBase = internalChartLevel * 100;
	const rawScore = perfectCount * 3 + greatCount * 2 + goodCount * 1 + badCount * 0.5;
	const maxScore = maxCombo * 3;

	ThrowIf(rawScore > maxScore, "Score cannot be greater than maximum possible score.", {
		rawScore,
		maxScore,
	});
	ThrowIf.negative(rawScore, "Score cannot be negative.", { rawScore });

	const percent = (rawScore / maxScore) * 100;

	let rating: number;
	if (percent <= 50) {
		rating = 0;
	} else {
		rating = levelBase - 10 * (100 - percent); // Fixed: was 0.1, should be 10
	}

	return Math.max(Math.floor(rating) / 100, 0);
}
