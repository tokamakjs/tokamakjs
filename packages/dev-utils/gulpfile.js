const { series, src, dest, watch } = require('gulp');
const path = require('path');
const gulpBabel = require('gulp-babel');
const rimraf = require('rimraf');
const gulpRename = require('gulp-rename');
const gulpTypescript = require('gulp-typescript');
const merge = require('merge-stream');

const PACKAGES_DIR = path.resolve(__dirname, '../../packages');

const ts = gulpTypescript.createProject('tsconfig.json', {
  noUnusedLocals: process.env.NODE_ENV !== 'development',
  noUnusedParameters: process.env.NODE_ENV !== 'development',
});

function cleanPackages() {
  return new Promise((r) => rimraf(`${PACKAGES_DIR}/*/lib`, r));
}

function buildPackages() {
  const buildTs = ts.src().pipe(ts());

  return merge(buildTs.js.pipe(gulpBabel()), buildTs.dts)
    .pipe(
      gulpRename((path) => {
        path.dirname = path.dirname.replace('src', 'lib');
      }),
    )
    .pipe(dest('./lib'));
}

// Tasks
module.exports.default = series(cleanPackages, buildPackages);
