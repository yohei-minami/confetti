import gulp from 'gulp';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import stripDebug from 'gulp-strip-debug';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import browser from "browser-sync";
import sass from 'gulp-sass';
import pleeease from 'gulp-pleeease';
import pug from 'gulp-pug';
import watch from 'gulp-watch';

const buildPath = './docs/';

const paths = {
  gulpFile: 'gulpfile.babel.js',
  js: 'resources/js/**/*.js',
  css: 'resources/css/**/*.scss',
  pug: 'resources/pug/**/*.pug',
  html: buildPath,
  jsDest: `${buildPath}/js`,
  cssDest: `${buildPath}/css`,
};

// pug
gulp.task('pug', function () {
  gulp.src(paths.pug)
    .pipe(plumber())
    .pipe(pug({
      pretty: util.env.development,
    }))
    .pipe(gulp.dest(paths.html));
});

// sass
gulp.task('sass', () => {
  gulp.src(paths.css)
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(pleeease({
      sass: true,
      autoprefixer: {"browsers": ["last 4 versions", 'ie 9', "Android 4.0"]},
      minifier: util.env.development,
    }))
    .pipe(gulp.dest(paths.cssDest));
});

// eslint
gulp.task('lint', () =>
gulp.src([
  './js/**/*.js',
])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

// compile javascript
gulp.task('webpack', () =>
gulp.src('./resources/js/**')
  .pipe(plumber())
  .pipe(webpack({
    entry: {
      index: ['babel-polyfill', './resources/js/index.js'],
      vendor: [
        'jquery',
        'underscore',
        'velocity-animate',
        'util',
        'events',
      ],
    },
    output: {
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['', '.js'],
    },
    plugins: [
      new CommonsChunkPlugin(
        'vendor',
        'vendor.bundle.js',
      )
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2016'],
          },
        },
        //{ test: /\.css$/, loader: "style!css" },
      ],
      preLoaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        }
      ]
    },
    eslint: {
      configFile: './.eslintrc.yaml'
    },
    cache: true,
    watch: util.env.watch,
    keepalive: true,
  }))
  .pipe(util.env.development ? util.noop() : stripDebug())
  .pipe(util.env.development ? util.noop() : uglify())
  .pipe(gulp.dest(paths.jsDest)),
);


gulp.task('watch', () => {

  // js
  util.env.watch = true;
  gulp.start(['webpack']);

  // sass
  watch(paths.css, () => {
    gulp.start(['sass']);
  });

  watch(paths.pug, () => {
    gulp.start(['pug']);
  });
});


gulp.task('server', () => {

  browser.init({
    server: "./docs/",
  });

  gulp.watch('./**/*.html', ['serverReload']);
  gulp.watch('./**/*.css', ['serverReload']);
  gulp.watch('./**/*.js', ['serverReload']);
});

gulp.task('serverReload', function() {
  browser.reload();
});

gulp.task('serverNoWatch', function() {
  browser.init({
    server: "./docs/"
  });
});

gulp.task('default', ['server', 'watch']);