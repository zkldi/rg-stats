# CHUNITHM Rating

CHUNITHM Rating functionality is exported under `CHUNITHMRating`. To use it,
```ts
import { CHUNITHMRating } from "rg-stats"
```

## About

Rating is an algorithm used in [CHUNITHM](https://chunithm.sega.com/). This algorithm is derived from the score (out of 1.01million) and an internal chart level.

!!! info
	The internal chart level is not displayed in game. Charts have a second component -- a decimal -- that changes how much rating they give.

	For example, a chart marked as level 12 may have an internal level of 12.0->12.5.
	
	Similarly, a chart marked as level 12+ may have an internal level of 12.5->12.9.

	People have figured out a lot of these values for charts online. You'll have to look for them.

!!! warning
	This calculates rating on a per-chart basis. The rating in game is a running average of these values, with the addition of an N20 (New 20) system. This means that your best 30 charts from the previous version of the game and your best 20 from the newest version of the game are taken in account. This change was made in CHUNITHM VERSE.

## `CHUNITHMRating.calculate()`

Calculates rating on a given chart.

### Signature

```ts
/**
 * Calculates the rating for a CHUNITHM score.
 * This is accurate up to X-VERSE-X.
 *
 * @param score - The score the user got. This is a value between 0 and 1.01million.
 * @param internalChartLevel - The internal chart level. This is a decimal value stored by the game internally.
 */
function calculate(score: number, internalChartLevel: number): number
```
