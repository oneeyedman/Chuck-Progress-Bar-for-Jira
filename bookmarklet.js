
const fs = require('fs');
const path = require('path');
fs.readFile('./js/chuck-progress-bar.min.js', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	const parts = data.split('export');
	const bookmark = `javascript:(function(){${parts[0]}})();`;
	const dirExists = fs.existsSync('./dist');

	!dirExists && fs.mkdir(path.join(__dirname, 'dist'), (err) => {
		if (err) {
			return console.error(err);
		}
	});
	fs.writeFile('./dist/chuck-progress-bar-for-jira.js', bookmark, { flag: 'a+' }, err => {
		if (err) {
			console.error(err);
			return;
		}
		console.log('🔖 Bookmarklet created successfully!');
	});
});
