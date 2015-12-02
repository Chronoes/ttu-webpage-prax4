require('babel-core/register')({
  optional: ['es7'],
});
import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import sass from 'gulp-sass';
import concatCss from 'gulp-concat';
import minifyCss from 'gulp-minify-css';
import eslint from 'gulp-eslint';
import sasslint from 'gulp-sass-lint';
import runSequence from 'run-sequence';
import minifyHtml from 'gulp-minify-html';
import sloc from 'gulp-sloc';
import cache from 'gulp-cached';
import remember from 'gulp-remember';
import watchify from 'watchify';

const directories = {
  root: './*.js',
  source: {
    base: 'src',
    index: 'src/index.html',
    scripts: 'src/scripts/**/*.jsx',
    main: 'src/scripts/main.jsx',
    styles: 'src/styles/**/*.scss',
    images: 'src/images/**/*',
  },
  api: 'api/**/*.php',
  distribution: 'prax4',
};

gulp.task('lint:sass', () => {
  return gulp.src(directories.source.styles)
    .pipe(remember('styles'))
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

gulp.task('lint:scripts', () => {
  return gulp.src(directories.source.scripts)
    .pipe(remember('scripts'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:scripts', 'lint:sass']);

gulp.task('line-count', () => {
  return gulp.src(
    [
      directories.root,
      directories.source.scripts,
      directories.api,
    ])
    .pipe(remember('scripts'))
    .pipe(sloc());
});

gulp.task('html', () => {
  return gulp.src(directories.source.index)
    .pipe(cache('html'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('html:production', () => {
  return gulp.src(directories.source.index)
    .pipe(minifyHtml())
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('images', () => {
  return gulp.src(directories.source.images)
    .pipe(cache('images'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('js', () => {
  const opts = {
    entries: directories.source.main,
    extensions: ['.jsx'],
    debug: true,
    transform: babelify.configure({
      optional: ['es7'],
    }),
  };
  return browserify(opts)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('js:watch', () => {
  const opts = Object.assign({
    entries: directories.source.main,
    extensions: ['.jsx'],
    debug: true,
    transform: babelify.configure({
      optional: ['es7'],
    }),
  }, watchify.args);
  return watchify(browserify(opts))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('js:production', () => {
  return browserify({
    entries: directories.source.main,
    extensions: ['.jsx'],
    debug: false,
    transform: babelify.configure({
      optional: ['es7'],
    }),
  })
  .transform({
    global: true,
    sourcemap: false,
  }, 'uglifyify')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(directories.distribution));
});

gulp.task('sass', () => {
  return gulp.src(directories.source.styles)
    .pipe(remember('styles'))
    .pipe(sass({includePaths: ['./node_modules/bootstrap/scss']}).on('error', sass.logError))
    .pipe(concatCss('style.css'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('sass:production', () => {
  return gulp.src(directories.source.styles)
    .pipe(sass({includePaths: ['./node_modules/bootstrap/scss']}).on('error', sass.logError))
    .pipe(concatCss('style.css'))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('build', () => {
  runSequence(['line-count', 'lint'], ['js', 'sass', 'html', 'images']);
});

gulp.task('build:watch', () => {
  runSequence(['line-count', 'lint'], ['js:watch', 'sass', 'html', 'images']);
});

gulp.task('build:production', () => {
  runSequence(['line-count', 'lint'], ['js:production', 'sass:production', 'html:production', 'images']);
});

gulp.task('watch', () => {
  return gulp.watch(
    [
      directories.source.scripts,
      directories.source.styles,
      directories.source.images,
    ], ['build:watch']);
});

gulp.task('default', ['build', 'watch']);
