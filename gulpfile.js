"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const server = require("browser-sync").create();
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const sourceMaps = require('gulp-sourcemaps');
const combiner = require('stream-combiner2').obj;
const del = require('del');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task("css", () => {
  return combiner(
    gulp.src("source/sass/**/*.scss"),
    gulpIf(isDevelopment, sourceMaps.init()),
    sass({
      includePaths: require('node-normalize-scss').includePaths
    }),
    concat('style.min.css'),
    autoprefixer({
      browsers: ["last 2 versions"]
    }),
    gulpIf(isDevelopment, cleanCss()),
    gulpIf(isDevelopment, sourceMaps.write()),
    gulp.dest("source/css")
  ).on("error", notify.onError())
    .pipe(server.stream())
});

gulp.task("clean", () => del("source/css"));

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("clean", "css", "server"));
