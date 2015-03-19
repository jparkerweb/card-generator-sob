// ==========================================
// ===             Require                ===
// ==========================================
	var runSequence = require('run-sequence'),
		browserSync = require('browser-sync'),
		gulp = require('gulp');

	var notify = require('gulp-notify'),
		clean = require('gulp-clean'),
		gulpif = require('gulp-if'),
		rubySass = require('gulp-ruby-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		csso = require('gulp-csso'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		header = require('gulp-header');
// ==========================================



// ==========================================
// ===         setup Path variables       ===
// ==========================================
	var sourcePaths = {
		SCSS: 'src/scss/**/*.scss',
		JS: 'src/js/**/*.js',
		JSBase: 'src/js/'
	};
	var destPaths = {
		BASE: './dist/',
		CSS: './dist/css/',
		JS: './dist/js/'
	};
// ==========================================



// =========================================
// ===           Enviro Variables        ===
// =========================================
	var minify = false;  // this is set to true when running the "default" task

	var pkg = require('./package.json');
	var banner = ['/**',
		' * <%= pkg.name %> - <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		''].join('\n');
// =========================================



// ==========================================
// ===           Static server            ===
// ==========================================
	// setup our browser-sync server
	gulp.task('browser-sync', function() {
		browserSync({
			server: {
				baseDir: "./dist/",
				index: "card.html"
			}
		});
	});
	// reload
	gulp.task('reload', function () {
		console.log('browser-sync reload');
		browserSync.reload();
	});
// ==========================================



// -------------------------
// --    task: SASS       --
// -------------------------
gulp.task('sass', function (callback) {
	runSequence(
		'clean-sass',
		'build-sass',
		callback);
});
	// clean our build path
	gulp.task('clean-sass', function () {
		return gulp.src([
				destPaths.CSS + '*.{css,css.map}'
			], {read: false})
			.pipe(clean());
	});
	// task: compile SASS to CSS and AutoPrefix
	gulp.task('build-sass', function () {

		return gulp.src(sourcePaths.SCSS)
			// HACK for rubySass:
			//'sourcemap=none': true
			// until pull request #114
			// https://github.com/sindresorhus/gulp-ruby-sass/pull/114
			// is merged into gulp-ruby-sass
			// this hack forces rubysass to not return source maps
			.pipe(rubySass({ style: 'expanded', 'sourcemap=none': true })).on('error', notify.onError({message: 'sass error: <%= error %>'}))
			.pipe(autoprefixer('last 4 versions'))
			.pipe(gulpif(minify, csso()))
			.pipe(header(banner, { pkg : pkg } ))
			.pipe(gulp.dest(destPaths.CSS))
			.pipe(browserSync.reload({stream: true}));
	});



// -------------------------
// --    task: Scripts    --
// -------------------------
gulp.task('scripts', function (callback) {
	runSequence(
		'clean-scripts',
		'build-scripts',
		'reload',
		callback);
});
	// clean our build path
	gulp.task('clean-scripts', function () {
		return gulp.src([
				'!' + destPaths.JS + 'gulpfile.js',
				destPaths.JS + '*.{js,js.map}'
			], {read: false})
			.pipe(clean());
	});

	// task: build scripts
	gulp.task('build-scripts', function () {
		return gulp.src(
				['./jquery.min.js', './jquery-ui.min.js', './rasterizeHTML.allinone.js', './card.js'],
				{ cwd: sourcePaths.JSBase }
			)
			.pipe(gulpif(minify, uglify()))
			.pipe(concat('card.min.js'))
			.pipe(gulp.dest('./dist/js/'));
	});



// -------------------------
// --     task: watch     --
// -------------------------
gulp.task('watch', function () {
	gulp.watch(sourcePaths.SCSS, ['sass']);
	gulp.watch(sourcePaths.JS, ['scripts']);
	gulp.watch(destPaths.BASE + '*.html', ['reload']);
});




// *************************
// ** Gulp tasks meant to **
// ** be run from command **
// ** line                **
// *************************
// ** gulp OR gulp alldev **
// *************************


// -------------------------
// --    task: default    --
// -------------------------
gulp.task('default', function (callback) {
	minify = true;
	runSequence(
		'sass',
		'scripts',
		callback);
});

// -------------------------
// --    task: alldev     --
// -------------------------
gulp.task('dev', function (callback) {
	minify = false;
	runSequence(
		'sass',
		'scripts',
		'watch',
		'browser-sync',
		callback);
});
