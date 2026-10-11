import { describe, expect, it } from 'vitest';
import { csvCell, parseVisionLog, scoreAnswers } from './validation';
const form = (values: Record<string, string>) => {
	const data = new FormData();
	for (const [k, v] of Object.entries(values)) data.set(k, v);
	return data;
};
describe('vision input', () => {
	it('accepts valid measurements', () => {
		expect(
			parseVisionLog(form({ left_eye: '-1.5', right_eye: '0', astigmatism: ' note ' }))
		).toEqual({ leftEye: -1.5, rightEye: 0, notes: 'note' });
	});
	it.each(['', 'NaN', 'Infinity', '41', '-41', 'abc'])('rejects invalid value %s', (value) => {
		expect(parseVisionLog(form({ left_eye: value, right_eye: '1' }))).toBeNull();
	});
	it('rejects overlong notes', () => {
		expect(
			parseVisionLog(form({ left_eye: '1', right_eye: '1', astigmatism: 'x'.repeat(1001) }))
		).toBeNull();
	});
});
describe('CSV export', () => {
	it('escapes CSV and neutralizes formula injection', () => {
		expect(csvCell('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"');
		expect(csvCell(-1.5)).toBe('"-1.5"');
	});
});
describe('server-side scoring', () => {
	const questions = [
		{ id: 1, answer: '74' },
		{ id: 2, answer: '2' }
	];
	it('ignores a forged score', () => {
		expect(scoreAnswers(questions, form({ answer_1: '0', answer_2: '2', score: '100' }))).toBe(50);
	});
	it('requires all answers and a nonempty test', () => {
		expect(scoreAnswers(questions, form({ answer_1: '74' }))).toBeNull();
		expect(scoreAnswers([], form({}))).toBeNull();
	});
});
