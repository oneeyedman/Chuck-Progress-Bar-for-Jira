'use strict';

function getTitles(list) {
	const cols = list.querySelectorAll('.ghx-column');
	const result = [...cols].map(header => {
		const element = header.querySelector('h2');
		const title = header.querySelector('h2').innerText;
		return {
			title,
			element
		};
	});
	return result;
}

function populateColumnsData(cols, obj) {
	const colData = cols.querySelectorAll('.ghx-column');
	colData.forEach((col, index) => {
		const issues = col.querySelectorAll('.ghx-issue').length;
		obj[index].issues = issues;
	});
}

function deleteUserComponent(selector) {
	const el = document.querySelectorAll(selector);
	el && el.forEach(el => el.remove());
}

function drawProgressBar(data, element, theme = 'default') {
	const themes = {
		'default': 'background-color:#0052cc;',
		'rainbow': 'background: linear-gradient(to right, red, orange, yellow, green, blue, purple);',
		'pride': 'background: linear-gradient(to right, red 0%, red 16.66666666%, orange 16.66666666%, orange 33.33333333%, yellow 33.33333333%, yellow 50%, green 50%, green 66.66666666%, blue 66.66666666%, blue 83.33333333%, purple 83.33333333%, purple 100%);'
	};
	const bg = themes[theme];
	deleteUserComponent('.chuck-progress-bar');
	const totalIssues = data.reduce((total, col) => total + col.issues, 0);
	const percentage = data[4].issues * 100 / totalIssues;
	const progressBar = `<section class="chuck-progress-bar" style="background-color:#f5f4f7;border-radius: 4px; padding: 10px 5px;margin-bottom: 7px;">
		<h1 class="chuck-progress-bar__title" style="color: #5e6c84;font-size:.85714286em;padding:5px 0 15px 5px;line-height: 1.33333333;text-transform: uppercase;font-weight: 400;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">Chuck Progress bar FTW</h1>
		<div class="chuck-progress-bar__track" style="background-color:#e5e6e7;border-radius: 2px;overflow: hidden;">
			
			<div class="chuck-progress-bar__current" style="${bg}border-radius: 2px;box-shadow:0 0 5px rgba(0,0,0,.2);height:30px;width:${percentage}%"></div>
		</div>
	</section>`;
	element.insertAdjacentHTML('afterbegin', progressBar);


}

function getTotalIssues() {
	const poolColumn = document.querySelector('#ghx-pool-column');
	if (poolColumn) {
		const headerCols = poolColumn.querySelector('.ghx-column-headers');
		const columns = getTitles(headerCols);
		const taskColumns = document.querySelector('.ghx-columns');
		populateColumnsData(taskColumns, columns);
		const [todo, inProgress, blocked, mrPending, done] = columns;
		const totalIssues = columns.reduce((total, col) => total + col.issues, 0);

		// Write progressbar
		drawProgressBar(columns, poolColumn, 'rainbow');
		// write column totals

		console.group('TASKS');
		console.log(`${todo.issues}/${totalIssues} \nDONE: ${done.issues}`);
		console.groupEnd();
	}
}

getTotalIssues();