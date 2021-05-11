'use strict'

 // === Imports ===
const { src, dest, series, watch } = require('gulp');

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// === BrowserSync ===
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

// === Settings ===
const settings = {
  scripts: true,
  styles: true,
  pug: true,
  copy: false,
}

const paths = {
  src: {
    main: './app',
    js: `${path.src.main}/js`,
    scss: `${paths.src.main}/scss/**/**/*.scss`,
    images: `${paths.src.main}/images/*`,
    pug: `${paths.src.main}/pug/`,
  },
  dist: {
    main: './build',
    css: `${paths.dist.main}/css`,
    js: `${paths.dist.main}/javascript`,
    images: `${paths.dist.main}/images`,
  },
};

const buildCSS = (done) => {
  if (!settings.styles) {
    return done();
  }

  return src('./app/scss/app.scss')
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('main.css'))
    .pipe(dest(paths.build.css))
    .pipe(browserSync.stream())
};

const buildPug = (done) => {
  if (!settings.pug) {
    return done();
  }

  return src(`${paths.src.pug}/*.pug`)
  .pipe(pug({
    pretty: false,
  }))
  .pipe(dist(paths.dist.main))
  .pipe(browserSync.stream())
}

const buildJS = (done) => {
  if (!settings.scripts) {
    return done();
  }

  return src(`${paths.src.scripts}/*.js`)
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}

const buildSVG = () => {
  return src('path/to/assets/*.svg')
    .pipe(svgSprite())
    .pipe(gulp.dest(paths.dist.images));
}

const watchers = () => {
  browserSync.init({
    server: {
      baseDir: paths.src.main,
      index: 'index.pug',
    },
  });

  watch(paths.src.scss, buildCSS);
  watch(paths.src.pug, buildPug);
  watch(paths.src.scripts, buildJS);
};

exports.default = series(
  buildCSS,
  buildPug,
  buildJS,
  buildSVG,
);

exports.watch = watchers;
