import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpTypescript from 'gulp-typescript';
import merge from 'merge-stream';
import rimraf from 'rimraf';

const ts = gulpTypescript.createProject('tsconfig.json', {
  noUnusedLocals: process.env.NODE_ENV !== 'development',
  noUnusedParameters: process.env.NODE_ENV !== 'development',
});

function cleanPackages() {
  return new Promise((r) => rimraf('./lib', r));
}

function buildLib() {
  const buildTs = gulp.src(['./src/**/*.{ts,tsx}', '!./src/**/*.test.*']).pipe(ts());
  return merge(buildTs.js.pipe(gulpBabel()), buildTs.dts).pipe(gulp.dest('./lib'));
}

function watchPackages() {
  gulp.watch(
    ['./src/**/*.{ts,tsx}', '!./src/**/*.test.{ts,tsx}'],
    { ignoreInitial: false },
    gulp.series(buildLib),
  );
}

// Tasks
export const watch = gulp.series(watchPackages);
export default gulp.series(cleanPackages, buildLib);
