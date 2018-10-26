"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const server = require("browser-sync").create();
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const webp = require('gulp-webp');
const svgstore = require("gulp-svgstore");
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const sourceMaps = require('gulp-sourcemaps');
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const combiner = require('stream-combiner2').obj;
const del = require('del');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task("css", () => {
  return combiner(
    gulp.src("source/sass/**/*.scss"),
    gulpIf(isDevelopment, sourceMaps.init()),
    sass(),
    concat('style.min.css'),
    autoprefixer({
      browsers: ["last 2 versions"]
    }),
    gulpIf(isDevelopment, csso()),
    gulpIf(isDevelopment, sourceMaps.write()),
    gulp.dest("build/css")
  ).on("error", notify.onError())
    .pipe(server.stream())
});

gulp.task('image', () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"))
});

gulp.task("webp", () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"))
});

gulp.task('sprite', () => {
  return gulp.src("source/img/**/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
});

gulp.task('html', () => {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
});

gulp.task('js', () => {
  return gulp.src("source/js/*.js")
    .pipe(gulp.dest("build/js"))
});

gulp.task("copy", () => {
  return gulp.src([
      "source/fonts/**",
      "source/img/**",
      "source/js/**",
    ],
    {
      base: "source"
    }
  )
    .pipe(gulp.dest("build"))
});

gulp.task("clean", () => del("build"));

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/**/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
});

gulp.task("refresh", (done) => {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "html"));
gulp.task("start", gulp.series("build", "server"));
