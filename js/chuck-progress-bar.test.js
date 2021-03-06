/* eslint-disable no-undef */
import {
	camelcase,
	getColumns,
	populateKanban,
	getTotalIssues,
	getIssueSummary,
	deleteUserComponent,
	drawChuckProgressBar,
	getChuckProgressBarTheme,
	drawColTotals,
	checkMainCols,
	getEmoji,
	getExtraTooltipClass} from './chuck-progress-bar.js';

document.body.innerHTML = `
		<div id="ghx-pool-column">
    <div class="ghx-column-headers">
      <div class="ghx-column" data-id="1">
        <h2 data-tooltip="To Do">To do</h2>
      </div>
      <div class="ghx-column" data-id="2">
        <h2 data-tooltip="In Progress">In Progress</h2>
      </div>
      <div class="ghx-column" data-id="3">
        <h2 data-tooltip="Blocked">Blocked</h2>
      </div>
      <div class="ghx-column" data-id="4">
        <h2 data-tooltip="MR Pending">MR Pending</h2>
      </div>
      <div class="ghx-column" data-id="5">
        <h2 data-tooltip="Done">Done</h2>
      </div>
    </div>
    <ul class="ghx-columns">
      <li class="ghx-column" data-column-id="1">
        <div class="ghx-issue">Issue 1</div>
        <div class="ghx-issue">Issue 2</div>
        <div class="ghx-issue">Issue 3</div>
      </li>
      <li class="ghx-column" data-column-id="2">
        <div class="ghx-issue">Issue 1</div>

      </li>
      <li class="ghx-column" data-column-id="3">
        <div class="ghx-issue">Issue 1</div>
        <div class="ghx-issue">Issue 2</div>
      </li>
      <li class="ghx-column" data-column-id="4">
      </li>
      <li class="ghx-column" data-column-id="5">
        <div class="ghx-issue">Issue 1</div>
        <div class="ghx-issue">Issue 2</div>
        <div class="ghx-issue">Issue 3</div>
        <div class="ghx-issue">Issue 4</div>
        <div class="ghx-issue">Issue 5</div>
        <div class="ghx-issue">Issue 6</div>
        <div class="ghx-issue">Issue 7</div>
        <div class="ghx-issue">Issue 8</div>
        <div class="ghx-issue">Issue 9</div>
        <div class="ghx-issue">Issue 10</div>
      </li>
    </ul>
  </div>`;
const poolColumn = document.querySelector('#ghx-pool-column');
const headerCols = poolColumn.querySelector('.ghx-column-headers');
const domIssues = poolColumn.querySelectorAll('.ghx-issue').length;
const domToDoIssues = poolColumn.querySelectorAll('[data-column-id="1"] .ghx-issue').length;
const domDoneIssues = poolColumn.querySelectorAll('[data-column-id="5"] .ghx-issue').length;
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





describe('Kanban object', () => {
	test('Should return kanban object: { toDo: {  el, dataId } }', () => {
		expect(getColumns(headerCols)).toEqual(
			expect.objectContaining({
				toDo: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String)
				}),
				inProgress: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String)
				}),
				blocked: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String)
				}),
				mrPending: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String)
				}),
				done: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String)
				})
			})
		);
	});

	test('Should populate Kanban object ', () => {
		const kanban = getColumns(headerCols);
		populateKanban(kanban);
		expect(kanban).toEqual(
			expect.objectContaining({
				toDo: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String),
					issues: expect.any(Number),
				}),
				inProgress: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String),
					issues: expect.any(Number),
				}),
				blocked: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String),
					issues: expect.any(Number),
				}),
				mrPending: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String),
					issues: expect.any(Number),
				}),
				done: expect.objectContaining({
					el: expect.any(Object),
					dataId: expect.any(String),
					issues: expect.any(Number),
				})
			})
		);
	});
});





describe('Generate an issue summary', () => {
	test(`There are 16 unique issues`, () => {
		const kanban = getColumns(headerCols);
		populateKanban(kanban);
		const totalIssues = getTotalIssues(kanban);
		expect(totalIssues).toBe(domIssues);
	});

	test(`There are 3 issues out of a total of 16.`, () => {
		const kanban = getColumns(headerCols);
		populateKanban(kanban);
		const summary = getIssueSummary(kanban);
		expect(summary).toEqual(expect.objectContaining({
			done: domDoneIssues,
			pending: domToDoIssues,
			total: domIssues
		}));
	});
});




describe('Paintint the Chuck Progress bar', () => {
	test('Delete previous progress bar', () => {
		poolColumn.insertAdjacentHTML('afterbegin', '<section class="chuck-progress-bar">:)</div>');
		deleteUserComponent('.chuck-progress-bar');

		const cpb = document.querySelector('.chuck-progress-bar');
		expect(cpb).toBe(null);
	});

	test('Successfully paint the progress bar element', () => {
		const kanban = getColumns(headerCols);
		populateKanban(kanban);
		const summary = getIssueSummary(kanban);
		drawChuckProgressBar(poolColumn, summary, 'rainbow');

		const cpb = document.querySelector('.chuck-progress-bar');
		expect(cpb).toEqual(expect.any(Object));
	});

	test('Successfully paint only 1 progress bar element', () => {
		const kanban = getColumns(headerCols);
		populateKanban(kanban);
		const summary = getIssueSummary(kanban);
		drawChuckProgressBar(poolColumn, summary, 'rainbow');

		const cpb = document.querySelectorAll('.chuck-progress-bar');
		expect(cpb.length).toBe(1);
	});

	test('Get a theme name', () => {
		const theme = getChuckProgressBarTheme('rainbow');
		expect(theme).toBe('rainbow');
	});

	test('Get a theme name in lower case', () => {
		const theme = getChuckProgressBarTheme('Rainbow');
		expect(theme).toBe('rainbow');
	});

	test('Get the default theme (no args)', () => {
		const theme = getChuckProgressBarTheme('');
		expect(theme).toBe('default');
	});

	test('Get the default theme (empty args)', () => {
		const theme = getChuckProgressBarTheme('');
		expect(theme).toBe('default');
	});

	test('Get the default theme (empty space)', () => {
		const theme = getChuckProgressBarTheme(' ');
		expect(theme).toBe('default');
	});
});





describe('Draw column totals', () => {
	test('Draw TO DO totals', () => {
		const kanban = getColumns(headerCols);
		populateKanban(kanban);
		drawColTotals(kanban);
		const headerText = document.querySelector(`.ghx-column[data-id="1"] h2`).textContent;
		expect(headerText).toBe(`To Do (${domToDoIssues})`);
	});
});





describe('Progress Bar initialisation', () => {
	test('The kanban board does have a "To Do" and "Done" columns', () => {
		const hasCols = checkMainCols('To Do', 'Done');
		expect(hasCols).toBe(true);
	});

	test('Column detector is case insensitive', () => {
		const hasCols = checkMainCols('To Do', 'DONE');
		expect(hasCols).toBe(true);
	});

	test('The kanban board  does not have a "To Dos" or "Done" column.', () => {
		const hasCols = checkMainCols('To Dos', 'Done');
		expect(hasCols).toBe(false);
	});
});





describe('Tooltip stuff', () => {
	test('The tooltip gets an ???? emoji because 10/7', () => {
		const poop = '????';
		expect(getEmoji(10,7)).toBe(poop);
	});

	test('The tooltip gets an ???? emoji because 7/10', () => {
		const unicorn = '????';
		expect(getEmoji(7, 10)).toBe(unicorn);
	});

	test('The tooltip gets a special class when percentage is equal or greater than 50%', () => {
		const per = 67;
		const result = 'tooltip--max';
		expect(getExtraTooltipClass(per)).toBe(result);
	});

	test('The tooltip doesn\'t get a special class when percentage is lower than 50%', () => {
		const per = 45;
		const result = '';
		expect(getExtraTooltipClass(per)).toBe(result);
	});
});
