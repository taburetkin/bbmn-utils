import gulp from 'gulp';
import mocha from 'gulp-mocha';
import { rollupForTest } from './lib';
const mochaGlobals = ['stub', 'spy', 'expect', 'Mn'];

function _mocha(setupFile) {
	//require('babel-register');
	return gulp.src(
		[setupFile,'test/unit/**/*.js'], //[setupFile, 'test/unit/**/*.js'],
		{read: false}
	)
		.pipe(mocha({
			reporter: 'dot',
			globals: mochaGlobals,
			ignoreLeaks: false,
			//compilers: 'js:babel-register'
			// compilers:'js:babel-core/register',
			require:'babel-register'
		}));
}


function test() {
	process.env.NODE_ENV = 'test';
	// require('babel-register')({
	// 	test: /node_modules/,
	// });
	return _mocha('test/setup.js');
}

const babelcfg = {
	include:['node_modules/bbmn-core']
}

gulp.task('rollup-test', () => rollupForTest('es'));
gulp.task('test', ['rollup-test'], test);
