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

// file and dir path of browserify
var path = {
    OUT: 'app.js',
    OUT_PRODUCT: 'app.min.js',
    DEST_BUILD: './public/js',
    ENTRY_POINT: glob.sync('./public/src/*.jsx')
};

// options of browserify
var props = {
    entries: path.ENTRY_POINT,
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
}

var bundler = watchify(browserify(props));

bundler.on('update', compile); // execute if there are some changes

gulp.task('watchify', compile);
gulp.task('default', ['watchify']);

gulp.task('product', function(){
    gulp.src(path.DEST_BUILD + '/*.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(path.DEST_BUILD))
    ;
});

function compile(){
    return bundler.bundle() //
        .on('error', function(err) {
            console.log(gutil.colors.red("Oops! you have ERROR! \n" + err.message));
            this.emit('end');
        })
        // //Pass desired output filename to vinyl-source-stream
        .pipe(source(path.OUT))
        // show duration time and filename
        .pipe(duration( 'compiled "' + path.OUT + '"' ))
        // output directory
        .pipe(gulp.dest(path.DEST_BUILD));
}