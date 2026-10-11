export function parseVisionLog(data: FormData) {
	const left = data.get('left_eye');
	const right = data.get('right_eye');
	const notes = data.get('astigmatism') ?? '';
	if (
		typeof left !== 'string' ||
		typeof right !== 'string' ||
		typeof notes !== 'string' ||
		!left.trim() ||
		!right.trim()
	)
		return null;
	const leftEye = Number(left),
		rightEye = Number(right);
	if (
		![leftEye, rightEye].every((n) => Number.isFinite(n) && Math.abs(n) <= 40) ||
		notes.length > 1000
	)
		return null;
	return { leftEye, rightEye, notes: notes.trim() };
}
export function csvCell(value: unknown) {
	let text = String(value ?? '');
	if (/^[\s]*[=+@-]/.test(text) && typeof value !== 'number') text = "'" + text;
	return '"' + text.replaceAll('"', '""') + '"';
}
export function scoreAnswers(questions: { id: string | number; answer: string }[], data: FormData) {
	if (!questions.length) return null;
	let correct = 0;
	for (const question of questions) {
		const value = data.get(`answer_${question.id}`);
		if (typeof value !== 'string' || value.length > 200 || !value.trim()) return null;
		if (value.trim().toLocaleLowerCase('ru') === question.answer.trim().toLocaleLowerCase('ru'))
			correct++;
	}
	return Math.round((correct / questions.length) * 100);
}
