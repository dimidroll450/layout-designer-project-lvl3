'use strict'

 // === Imports ===
const { src, dest, series, watch } = require('gulp');

const del = require('del');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
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

const baseSrc = './app';
const baseDest = './build';

const paths = {
  src: {
    js: `${baseSrc}/js/main.js`,
    scss: `${baseSrc}/scss/main.scss`,
    pug: baseSrc,
    images: `${baseSrc}/images`,
  },
  dist: {
    js: `${baseDest}/js`,
    css: `${baseDest}/css`,
    images: `${baseDest}/images`,
  },
  watch: {
    js: `${baseSrc}/js/**/*.js`,
    scss: `${baseSrc}/scss/**/*.scss`,
    pug: baseSrc,
    images: `${baseSrc}/images`,
  }
};

const cleanBuild = () => del(`${baseDest}/**/*`, { force: true })

const buildCSS = (done) => {
  if (!settings.styles) {
    return done();
  }

  return src(paths.src.scss)
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('style.css'))
    .pipe(dest(paths.dist.css))
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
  .pipe(dest(baseDest))
  .pipe(browserSync.stream())
}

const buildJS = (done) => {
  if (!settings.scripts) {
    return done();
  }

  return src([
    paths.src.js,
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
  ])
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(dest(paths.dist.js))
    .pipe(browserSync.stream());
}

const buildSVG = () => {
  return src(`${paths.src.images}/**/*.svg`)
    .pipe(svgSprite())
    .pipe(dest(paths.dist.images));
}

const watchers = () => {
  watch(paths.watch.scss, buildCSS);
  watch(paths.watch.pug, buildPug);
  watch(paths.watch.js, buildJS);

  browserSync.init({
    server: {
      baseDir: baseDest,
    },
    watch: true,
    notify: false,
    online: false,
  });
};

exports.default = series(
  cleanBuild,
  buildCSS,
  buildPug,
  buildJS,
  buildSVG,
);

exports.watch = watchers;
