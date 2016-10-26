"use strict";

var gulp = require('gulp');
var duration = require('gulp-duration');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var glob = require('glob');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');


// file and dir path_jsx of browserify
var path_jsx = {
    OUT: 'app.js',
    OUT_PRODUCT: 'app.min.js',
    DEST_BUILD: './public/js',
    ENTRY_POINT: glob.sync('./public/src/*.jsx')
};

// options of browserify
var props = {
    entries: path_jsx.ENTRY_POINT,
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
}

var bundler = watchify(browserify(props));
bundler.on('update', compile); // execute if there are some changes
gulp.task('watchify', compile);

gulp.task('default', ['watchify', 'sass']);

gulp.task('sass', function() {
    return gulp.src('./public/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('product', function(){
    gulp.src(path_jsx.DEST_BUILD + '/*.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(path_jsx.DEST_BUILD));
});

function compile(){
    return bundler.bundle() //
        .on('error', function(err) {
            console.log(gutil.colors.red("Oops! you have ERROR! \n" + err.message));
            this.emit('end');
        })
        // //Pass desired output filename to vinyl-source-stream
        .pipe(source(path_jsx.OUT))
        // show duration time and filename
        .pipe(duration( 'compiled "' + path_jsx.OUT + '"' ))
        // output directory
        .pipe(gulp.dest(path_jsx.DEST_BUILD));
}