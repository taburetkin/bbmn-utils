import gulp from 'gulp';
import concat from 'gulp-concat-util';
import pathUtil from 'path';

function getName(filePath){
	let fp = pathUtil.relative('src', filePath);
	let chunks = fp.split(/\/|\\/);
	let fullname = chunks.pop();
	return fullname.split('.').shift();
}



gulp.task('docs:clean', function(){
	return del(['README.md','src/**/README.md']);
});


gulp.task('docs:table-contents', function(){
	gulp.src('src/**/*.short.md')
	.pipe(concat('contents.md', {
		process: function(src, filePath){
			let name = getName(filePath);
			let desc = src.length ? ' - ' + src : '';
			let item = `* [${name}](#${name})` + desc + '\r\n';
			return item;
		}
	}))
	.pipe(concat.header('# table of contents\r\n\r\n'))
	// .pipe(concat('README.md', { process: function(src, filePath){
	// 	let dirPath = toRelative(filePath, true);
	// 	console.log('~', dirPath, '	', normalizedFolder);
	// 	return src;
	// }}))
	.pipe(gulp.dest('src'))
});

gulp.task('docs:full-content', ['docs:table-contents'], function(){
	gulp.src(['src/contents.md', 'src/**/*.full.md'])
	.pipe(concat('README.md', {
		process: function(src, filePath){
			let name = getName(filePath);
			if(name == 'contents') return src;

			let desc = !src.length ? 'sorry, there is no documentation yet :-( ': src;
			let item = `# ${name}\r\n\r\n` + desc + '\r\n';
			return item;
		}
	}))	
	// .pipe(concat('README.md', { process: function(src, filePath){
	// 	let dirPath = toRelative(filePath, true);
	// 	console.log('~', dirPath, '	', normalizedFolder);
	// 	return src;
	// }}))
	.pipe(gulp.dest('src'))
});

gulp.task('docs',['docs:full-content'], function(){
	gulp.src(['/header.md', 'src/readme.md'])
	.pipe(concat('README.md'))
	.pipe(gulp.dest('./'))
});
