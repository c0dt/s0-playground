const gulp = require("gulp");

const webpack = require("webpack");
const webpackStream = require("webpack-stream");

const browserSync = require('browser-sync').create();

const filter = require('gulp-filter');
const gulpPngquant = require('gulp-pngquant');
const zip = require('gulp-zip');

let webpackConfig = require("./webpack.config");

gulp.task('webpack-release', () => {
  let webpackConfig = require("./webpack.production.config");
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("build/release"));
});

gulp.task('webpack-debug', () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("build/debug"));
});

gulp.task('copy-assets-debug', () => {
  return gulp.src('./resources/**')
    .pipe(gulp.dest('./build/debug/'));
});

gulp.task('copy-assets', () => {
  const pngFilter = filter('**/*.png', { restore: true });
  return gulp.src('./resources/**')
    .pipe(pngFilter)
    .pipe(gulpPngquant({
      quality: '65-80'
    }))
    .pipe(pngFilter.restore)
    .pipe(gulp.dest('./build/debug/'));
});

gulp.task('zip', () => {
  return gulp.src('./build/debug/**', { base: './build/debug/' })
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: "./build/debug"
  });
  gulp.watch("packages/**/*.glsl", gulp.series('webpack-debug'));
  gulp.watch("packages/**/*.js", gulp.series('webpack-debug'));
  gulp.watch("src/**/*.js", gulp.series('webpack-debug'));
  gulp.watch("build/debug/**/*.*").on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('serve', 'copy-assets-debug', 'webpack-debug'));
gulp.task('debug-build', gulp.series('copy-assets', 'webpack-debug', 'zip'));
gulp.task('release-build', gulp.series('copy-assets', 'webpack-release', 'zip'));