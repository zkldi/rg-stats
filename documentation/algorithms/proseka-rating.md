# PROSEKA Rating

PROSEKA Rating functionality is exported under `PROSEKARating`. To use it,
```ts
import { PROSEKARating } from "rg-stats"
```

## About

This is an unofficial, community made rating system by the 39S community for the game Project Sekai: Colorful Stage! based on an EXscore system. It is used in the sekaitachi project as a way to provide better player ranking metrics.
The judgements use the points ranked matches award per judgement.

!!! info
	The internal chart level is not displayed in game. Charts have a community rating -- a decimal -- that changes how much rating they give.

	For example, a chart marked as level 36 in game may have a community level of 36.0->36.9.

	They are being actively decided by the community and updated.

!!! warning
	This calculates rating on a per-chart basis. Your profile rating is a running average of these values, being affected by B30.

## `PROSEKARating.calculate()`

Calculates rating on a given chart.

### Signature

```ts
/**
 * Calculates the rating for a proseka score.
 * System developed by coul, not officially by SEGA.
 * Judgement weights are accurate to ranked match standards.
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
)
```
