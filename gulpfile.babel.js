var gulp = require('gulp')
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var rollup = require('gulp-better-rollup')

const $ = gulpLoadPlugins()

gulp.task('extras', () => gulp.src([
  'app/*.*',
  'app/_locales/**',
  '!app/scripts.babel',
  '!app/*.json',
  '!app/*.html',
], {
  base: 'app',
  dot: true,
}).pipe(gulp.dest('dist')))

function lint(files, options) {
  return () => gulp.src(files)
}

gulp.task('lint', lint('app/scripts.babel/**/*.js'))

gulp.task('images', () => gulp.src('app/images/**/*.png')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{ cleanupIDs: false }],
    }))
    .on('error', function (err) {
      console.log(err)
      this.end()
    })))
    .pipe(gulp.dest('dist/images')))

gulp.task('html', () => gulp.src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({ removeComments: true, collapseWhitespace: true })))
    .pipe(gulp.dest('dist')))

gulp.task('license', () => gulp
  .src('LICENSE')
  .pipe(gulp.dest('./dist')),
)

gulp.task('chromeManifest', () => gulp
  .src('app/manifest.json')
  .pipe($.chromeManifest({
    // buildnumber: true,
    background: {
      target: 'scripts/background.js',
      exclude: [
        'scripts/chromereload.js',
      ],
    },
  }))
  .pipe($.addSrc('app/scripts/importer.js', {
    base: 'app',
  }))
  .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
  .pipe($.if('*.js', $.sourcemaps.init()))
  .pipe($.if('*.js', $.uglify()))
  // .pipe($.if('*.js', $.sourcemaps.write('.')))
  .pipe(gulp.dest('dist')))

gulp.task('babel', () => gulp.src('app/scripts.babel/**/*.js')
  .pipe($.plumber())
  // .pipe($.babel({
  //   presets: ['es2015'],
  // }))
  .pipe(rollup({
    // notice there is no `entry` option as rollup integrates into gulp pipeline
    plugins: [
      require('rollup-plugin-node-resolve')(),
      require('rollup-plugin-commonjs')(),
      require('rollup-plugin-babel')({
        exclude: 'node_modules/**'
      })
    ]
  }, {
    // also rollups `sourceMap` option is replaced by gulp-sourcemaps plugin
    format: 'iife',
  }))
  .pipe(gulp.dest('app/scripts')))

gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'app/scripts']))

gulp.task('watch', ['lint', 'babel'], () => {
  $.livereload.listen()

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json',
  ]).on('change', $.livereload.reload)

  gulp.watch('app/scripts.babel/**/*.js', ['lint', 'babel'])
  gulp.watch('bower.json', ['wiredep'])
})

gulp.task('size', () => gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true })))

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'))
})

gulp.task('package', () => {
  const manifest = require('./dist/manifest.json')
  return gulp.src('dist/**')
      .pipe($.zip(`${manifest.version}.zip`))
      .pipe(gulp.dest('package'))
})

gulp.task('build', (cb) => {
  runSequence(
    'clean',
    'lint', 'babel', 'chromeManifest', 'license',
    ['html', 'images', 'extras'],
    'size', cb)
})

gulp.task('default', ['clean'], (cb) => {
  runSequence('build', cb)
})
