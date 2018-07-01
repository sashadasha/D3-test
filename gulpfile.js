var gulp = require('gulp'),
	sass = require('gulp-sass'),
	bs = require('browser-sync').create(),
	concat = require('gulp-concat'),
 	sourcemaps = require('gulp-sourcemaps')
 	gutil = require('gulp-util');

gulp.task('browser-sync', ['sass'], function() {
    bs.init({
		proxy: "localhost/D3/public"
    });
});

gulp.task('sass', function () {
    return gulp.src('source/assets/scss/styles.scss')
                .pipe(sass())
                .pipe(gulp.dest('public/assets/css'))
                .pipe(bs.reload({stream: true}));
});

gulp.task('copyJs', function () {
    return gulp.src('source/assets/js/*.js')
                .pipe(gulp.dest('public/assets/js'));
});

// copy html
gulp.task('copyHtml', function () {
    return gulp.src('source/*.html')
                .pipe(gulp.dest('public'))
                .pipe(bs.reload({stream: true}));
});

// copy external data files
gulp.task('copyData', function () {
    return gulp.src('source/assets/data/*.+(json|csv|txt|xls|tsv)')
                .pipe(gulp.dest('public/assets/data'))
                .pipe(bs.reload({stream: true}));
});

// minify js
gulp.task('build-js', function() {
  return gulp.src('source/assets/js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/js'));
});

gulp.task('watch', ['browser-sync'], function () {
	/*css*/
    gulp.watch("source/assets/scss/styles.scss", ['sass']);
    gulp.watch("public/assets/css/styles.css").on('change', bs.reload);
    /*js*/
    gulp.watch("source/assets/js/*.js", ['copyJs']);
    gulp.watch("public/assets/js/*.js").on('change', bs.reload);
    /*json*/
    gulp.watch("source/assets/data/*.+(json|csv|txt|xls|tsv)", ['copyData']);
    gulp.watch("public/assets/data/*.+(json|csv|txt|xls|tsv)").on('change', bs.reload);
    /*html*/
    gulp.watch("source/*.html", ['copyHtml']);
    gulp.watch("public/*.html").on('change', bs.reload);
});