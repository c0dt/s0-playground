const gulp = require("gulp");

const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config");

const browserSync = require('browser-sync').create();

const filter = require('gulp-filter');
const gulpPngquant = require('gulp-pngquant');
const zip = require('gulp-zip');

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("build/debug"));
});

gulp.task('copy-assets', () => {
  const pngFilter = filter('**/*.png', {restore: true});
  return gulp.src('./resources/**')
    .pipe(pngFilter)
    .pipe(gulpPngquant({
        quality: '65-80'
    }))
    .pipe(pngFilter.restore)
    .pipe(gulp.dest('./build/debug/'));
});

gulp.task('zip', () => {
    return gulp.src('./build/debug/**', {base: './build/debug/'})
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', gulp.series('copy-assets', 'webpack'), ()=> {
    browserSync.init({
        server: "./build/debug"
    });
    gulp.watch("src/**/*.js", ['default']);
    gulp.watch("build/debug/**/*.*").on('change', browserSync.reload);
});

gulp.task('debug-build', gulp.series('copy-assets', 'webpack', 'zip'), ()=> {

});