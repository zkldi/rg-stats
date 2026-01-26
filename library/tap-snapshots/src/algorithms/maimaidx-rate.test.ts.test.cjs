/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if lamp is ALL PERFECT but score is below 100.5%. 1`] = `
Invalid input, Cannot have an ALL PERFECT without at least 100.5%. score=100.4, lamp="ALL PERFECT".
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if lamp is ALL PERFECT+ but score is not 101%. 1`] = `
Invalid input, Cannot have an ALL PERFECT+ without 101%. score=100.5, lamp="ALL PERFECT+".
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if lamp is CLEAR but score is below 80%. 1`] = `
Invalid input, A score of <80% should not be a CLEAR. score=79, lamp="CLEAR".
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if lamp is FAILED but score is above 80%. 1`] = `
Invalid input, A score of >=80% should not be a FAILED. score=81, lamp="FAILED".
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if level is negative. 1`] = `
Invalid input, Internal chart level cannot be negative. level=-1.
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if score is 101% but lamp is not ALL PERFECT+ 1`] = `
Invalid input, A score of 101% should be an ALL PERFECT+. score=101, lamp="ALL PERFECT".
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if score is greater than 101%. 1`] = `
Invalid input, Score cannot be greater than 101%. score=101.5.
`

exports[`src/algorithms/maimaidx-rate.test.ts TAP maimai DX Rate Validation Tests > Should throw if score is negative. 1`] = `
Invalid input, Score cannot be negative. score=-1.
`
