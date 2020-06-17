const { series, src, dest } = require('gulp');
const path = require('path');
const gulpBabel = require('gulp-babel');
const rimraf = require('rimraf');
const gulpRename = require('gulp-rename');
const gulpTypescript = require('gulp-typescript');
const merge = require('merge-stream');

const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
const DIST_DIR = path.resolve(__dirname, '../../dist');

const ts = gulpTypescript.createProject('tsconfig.json');

function cleanPackages() {
  return new Promise((r) => rimraf(`${PACKAGES_DIR}/*/lib`, r));
}

function cleanBundles() {
  return new Promise((r) => rimraf(DIST_DIR, r));
}

function buildPackages(next) {
  const buildTs = src(`${PACKAGES_DIR}/*/src/**/*.ts`).pipe(ts());

  return merge(buildTs.js, buildTs.dts)
    .pipe(
      gulpRename((path) => {
        path.dirname = path.dirname.replace('src', 'lib');
      }),
    )
    .pipe(dest(PACKAGES_DIR));
}

// Tasks
module.exports.default = series(cleanPackages, buildPackages);
