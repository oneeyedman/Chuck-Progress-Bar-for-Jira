/* eslint-disable no-undef */
import { 
	camelcase,
	getColumns,
	populateKanban,
	getTotalIssues,
	getIssueSummary,
	deleteUserComponent,
	drawChuckProgressBar } from './chuck-progress-bar.js';

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
	
});