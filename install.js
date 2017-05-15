var task = module.exports,
	path = require('path'),
	Q = null,
	shelljs = null,
	utils = null,
	templateData = null,
	projectDir = null,
	BowerAddTask = null;

task.run = function run(cli, targetPath) {
	projectDir = targetPath;
	Q = cli.require('q');
	shelljs = cli.require('shelljs');
	utils = cli.utils;
	project = cli.cb_require('project/project').load(projectDir);
	templateData = {
		project: project.data()
	};

	if (cli.require_task) {
		var engine = project.get('engine') || 'default';
		BowerAddTask = cli.require_task('bower-add', engine);
	}
	else {
		BowerAddTask = cli.cb_require('tasks/bower-add');
	}

	project.set('main', 'src/web/index.html');
	var bowerOverrides = project.get('bowerOverrides') || {};
	bowerOverrides.bootstrap = bowerOverrides.bootstrap || {};
	bowerOverrides.bootstrap.main = [
		'dist/js/bootstrap.js',
		'dist/css/bootstrap.css'
	];

	project.set('bowerOverrides', bowerOverrides);
	project.save();

	return Q()
		.then(copySources)
		.then(installBowerDependencies);
};

function copySources() {
	var src = path.join(__dirname, 'src'),
		target = path.join(projectDir, 'src'),
		extensions = /\.(html|css|js|prw)/;

	utils.copyTemplate(src, target, templateData, extensions);

	src = path.join(target, 'advpl', 'program.prw');
	target = path.join(target, 'advpl', templateData.project.name + '.prw');

	shelljs.mv(src, target);
}

function installBowerDependencies() {
	var bower = new BowerAddTask({
		silent: true,
		target: projectDir
	});

	return bower.install(['cloudbridge-core-js', 'jquery', 'bootstrap']);
}
