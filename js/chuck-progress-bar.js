function camelcase(str) {
	const parts = str.toLowerCase().split(' ');
	for (let i = 0; i < parts.length; i++) {
		if (i > 0) {
			const letters = parts[i].split('');
			letters[0] = letters[0].toUpperCase();
			parts[i] = letters.join('');
		}
	}
	return parts.join('');
}





function getColumns(list) {
	const cols = list.querySelectorAll('.ghx-column');
	const result = {};
	cols.forEach(col => {
		const element = col.querySelector('h2');
		const dataId = col.dataset.id;
		const title = col.querySelector('h2').textContent;
		result[camelcase(title)] = {el: element, dataId};
	});
	return result;
}




function populateKanban(obj) {
	for (const prop in obj) {
		const {dataId} = obj[prop];
		const col = document.querySelector(`[data-column-id="${dataId}"]`);
		const issues = col.querySelectorAll('.ghx-issue').length;
		obj[prop].issues = issues;
	}
	return obj;
}




function getTotalIssues(obj) {
	let result = 0;
	for (const prop in obj) {
		result += obj[prop].issues;
	}
	return result;
}




function getIssueSummary(obj) {
	const total = getTotalIssues(obj);
	const {toDo, done} = obj;
	const pending = toDo.issues;
	const doneIssues = done.issues;
	return { pending, done: doneIssues, total};
}




function drawChuckProgressBar(container, obj, theme='default') {
	const themes = {
		'default': 'background-color:#0052cc;',
		'rainbow': 'background: linear-gradient(to right, red, orange, yellow, green, blue, purple);',
		'pride': 'background: linear-gradient(to right, red 0%, red 16.66666666%, orange 16.66666666%, orange 33.33333333%, yellow 33.33333333%, yellow 50%, green 50%, green 66.66666666%, blue 66.66666666%, blue 83.33333333%, purple 83.33333333%, purple 100%);'
	};
	const bg = themes[theme] || themes['default'];

	deleteUserComponent('.chuck-progress-bar');
	
	const {done, total} = obj;
	const percentage = done * 100 / total;
	const progressBar = `<section class="chuck-progress-bar" style="background-color:#f5f4f7;border-radius: 4px; padding: 10px 5px;margin-bottom: 7px;">
		<h1 class="chuck-progress-bar__title" style="color: #5e6c84;font-size:.85714286em;padding:5px 0 15px 5px;line-height: 1.33333333;text-transform: uppercase;font-weight: 400;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">Chuck Progress bar FTW</h1>
		<div class="chuck-progress-bar__track" style="background-color:#e5e6e7;border-radius: 2px;overflow: hidden;">
			
			<div class="chuck-progress-bar__current" style="${bg}border-radius: 2px;box-shadow:0 0 5px rgba(0,0,0,.2);height:30px;width:${percentage}%"></div>
		</div>
	</section>`;
	container.insertAdjacentHTML('afterbegin', progressBar);
}





function deleteUserComponent(selector) {
	const el = document.querySelectorAll(selector);
	el && el.forEach(el => el.remove());
}





function initKanban() {
	const poolColumn = document.querySelector('#ghx-pool-column');
	if (poolColumn) {
		const headerCols = poolColumn.querySelector('.ghx-column-headers');
		const kanban = getColumns(headerCols);

		populateKanban(kanban);
		const {pending, total} = getIssueSummary(kanban);

		// Write progressbar
		drawChuckProgressBar(poolColumn, getIssueSummary(kanban), `prides`);
		// write column totals
		console.group('TASKS');
		console.log(`${pending}/${total} \nDONE: ???`);
		console.groupEnd();
	}
}

initKanban();

export { 
	camelcase,
	getColumns,
	populateKanban,
	getTotalIssues,
	getIssueSummary,
	deleteUserComponent,
	drawChuckProgressBar };