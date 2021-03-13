/* eslint-disable no-undef */
import {camelcase} from './chuck-progress-bar.js';

describe('CamelCase converter', () => {
	const inputs = [
		{
			'label': 'To Do',
			'result': 'toDo'
		},
		{
			'label': 'In Progress',
			'result': 'inProgress'
		},
		{
			'label': 'MR Pending',
			'result': 'mrPending'
		},
		{
			'label': 'Blocked',
			'result': 'blocked'
		},
		{
			'label': 'Done',
			'result': 'done'
		},
	];
	inputs.forEach(input => {
		test(`camelcase('${input.label}') = '${input.result}'`, () => {
			expect(camelcase(input.label)).toBe(input.result);
		});
	});

});