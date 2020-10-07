const { series, dest, watch } = require('gulp');
const gulpBabel = require('gulp-babel');
const rimraf = require('rimraf');
const gulpTypescript = require('gulp-typescript');
const merge = require('merge-stream');

const ts = gulpTypescript.createProject('tsconfig.json', {
  noUnusedLocals: process.env.NODE_ENV !== 'development',
  noUnusedParameters: process.env.NODE_ENV !== 'development',
});

function cleanPackages() {
  return new Promise((r) => rimraf('./lib', r));
}

function buildPackages() {
  const buildTs = ts.src().pipe(ts());
  return merge(buildTs.js.pipe(gulpBabel()), buildTs.dts).pipe(dest('./lib'));
}

function watchPackages() {
  watch(
    ['./src/**/*.{ts,tsx}', '!./src/**/*.test.{ts,tsx}'],
    { ignoreInitial: false },
    series(buildPackages),
  );
}

// Tasks
module.exports.default = series(cleanPackages, buildPackages);
module.exports.watch = series(watchPackages);
