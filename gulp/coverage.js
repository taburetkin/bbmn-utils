import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import { Instrumenter } from 'isparta';
import { test } from './test';
import registerBabel from './register-babel';

function coverage(done) {
	
	registerBabel();
	
	gulp.src(['src/**/*.js'])
		.pipe(istanbul({ instrumenter: Instrumenter }))
		.pipe(istanbul.hookRequire())		
		.on('finish', function() {
		return test()
			.pipe(istanbul.writeReports())
			.on('end', done);
		});
}

gulp.task('coverage', coverage);
