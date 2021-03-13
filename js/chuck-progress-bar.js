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
		const title = col.querySelector('h2').dataset.tooltip;
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




function getChuckProgressBarTheme(theme) {
	theme = theme.trim().toLocaleLowerCase();
	const themes = [
		'rainbow',
		'pride'
	];
	const userTheme = theme && themes.includes(theme) ? theme : 'default' ;

	return userTheme;
}




function drawChuckProgressBar(container, obj, theme='default') {
	const userTheme = getChuckProgressBarTheme(theme);
	deleteUserComponent('.chuck-progress-bar');
	const {done, total} = obj;
	const percentage = done * 100 / total;
	const progressBar = `<section class="chuck-progress-bar chuck-progress-bar--${userTheme}">
		<style>
			.chuck-progress-bar {
				background-color: #f5f4f7;
				border-radius: 4px; 
				padding: 10px 5px;
				margin-bottom: 7px;
			}
			.chuck-progress-bar__title {
				color: #5e6c84;
				font-size: .85714286em;
				margin: 0;
				padding: 5px 0 15px 5px;
				line-height: 1.33333333;
				text-transform: uppercase;
				font-weight: 400;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.chuck-progress-bar__track {
				background-color: #e5e6e7;
				border-radius: 2px;
				overflow: hidden;
			}
			.chuck-progress-bar__current {
				background-color:#0052cc;
				border-radius: 2px;
				box-shadow: 0 0 5px rgba(0,0,0,.2);
				height: 30px;
			}

			.chuck-progress-bar--rainbow .chuck-progress-bar__current {
				background: linear-gradient(to right, red, orange, yellow, green, blue, purple);
			}
			.chuck-progress-bar--pride .chuck-progress-bar__current {
				background: linear-gradient(to right, red 0%, red 16.66666666%, orange 16.66666666%, orange 33.33333333%, yellow 33.33333333%, yellow 50%, green 50%, green 66.66666666%, blue 66.66666666%, blue 83.33333333%, purple 83.33333333%, purple 100%);
			}
		</style>
		<h1 class="chuck-progress-bar__title">Chuck Progress bar FTW</h1>
		<div class="chuck-progress-bar__track">
			<div class="chuck-progress-bar__current" style="width:${percentage}%"></div>
		</div>
	</section>`;
	container.insertAdjacentHTML('afterbegin', progressBar);
}





function deleteUserComponent(selector) {
	const el = document.querySelectorAll(selector);
	el && el.forEach(el => el.remove());
}





function drawColTotals(obj) {
	for (const prop in obj) {
		const header = document.querySelector(`.ghx-column[data-id="${obj[prop].dataId}"] h2`);
		const label = header.dataset.tooltip;
		header.textContent = `${label} (${obj[prop].issues})`;
	}
}




function checkMainCols(todo, done) {

	const headerCols = document.querySelectorAll('.ghx-column-headers .ghx-column');
	const headers = [...headerCols].map(col => col.querySelector('h2').dataset.tooltip);
	const hasCols = headers.includes(todo) && headers.includes(done);
	return hasCols;
}




function initKanban(config) {
	const {theme, todo, done} = config;
	const poolColumn = document.querySelector('#ghx-pool-column');
	if (poolColumn) {
		const headerCols = poolColumn.querySelector('.ghx-column-headers');
		const hasMainCols = checkMainCols(todo, done);

		if (hasMainCols) {
			const kanban = getColumns(headerCols);
			populateKanban(kanban);
			drawChuckProgressBar(poolColumn, getIssueSummary(kanban), theme);
			drawColTotals(kanban);
		}
	}
}

initKanban({theme: 'default', todo: 'To Do', done: 'Done'});

export { 
	camelcase,
	getColumns,
	populateKanban,
	getTotalIssues,
	getIssueSummary,
	deleteUserComponent,
	drawChuckProgressBar,
	getChuckProgressBarTheme,
	drawColTotals,
	checkMainCols
};