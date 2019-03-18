const gulp            = require('gulp');
const browserSync     = require('browser-sync').create();
const pug             = require('gulp-pug');
const sass            = require('gulp-sass');
const spritesmith     = require('gulp.spritesmith');
const rimraf          = require('rimraf');
const rename          = require('gulp-rename');
const uglify          = require('gulp-uglify');
const concat          = require('gulp-concat')
const sourcemaps      = require('gulp-sourcemaps');
const plumber         = require('gulp-plumber');
const notify          = require("gulp-notify");
const cssnano         = require('gulp-cssnano');
const postcss         = require('gulp-postcss');
const autoprefixer    = require('autoprefixer');
const svgSprite       = require('gulp-svg-sprite');
const svgmin          = require('gulp-svgmin');
const cheerio         = require('gulp-cheerio');
const replace         = require('gulp-replace');


/* -------- Server  -------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/pages/**/*.*')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9', '> 1%'],
      cascade: false
    }) ]))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

/* ------------ js ------------- */

gulp.task('js', function () {
  return gulp.src([
    'source/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));

});

/* ------------ libs ------------- */
gulp.task('libs', function() {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery-migrate/dist/jquery-migrate.min.js',
    './node_modules/slick-carousel/slick/slick.min.js',
    './node_modules/jquery-ui-dist/jquery-ui.min.js',
    './node_modules/waypoints/lib/jquery.waypoints.min.js',
    './node_modules/jquery.counterup/jquery.counterup.min.js',
    './node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
    './node_modules/svg4everybody/dist/svg4everybody.min.js'
  ])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));

  gulp.src([
    './node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
    './node_modules/font-awesome/fonts/fontawesome-webfont.woff',
    './node_modules/font-awesome/fonts/fontawesome-webfont.woff2'
  ])
    .pipe(gulp.dest('build/fonts'));

  gulp.src([
    './node_modules/jquery-ui-dist/images/*.*'
  ])
    .pipe(gulp.dest('build/css/images'));

  return gulp.src([
    './node_modules/slick-carousel/slick/slick.css',
    './node_modules/font-awesome/css/font-awesome.css',
    './node_modules/jquery-ui-dist/jquery-ui.min.css'
  ])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('libs.min.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));

});

/* ------------ Sprite png ------------- */
gulp.task('sprite-png', function(cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

/* ------------ Sprite svg ------------- */

gulp.task('sprite-svg', function () {
  return gulp.src('source/images/icons/*.svg')
  // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../images/sprite.svg",
          render: {
            scss: {
              dest:'../../source/styles/global/sprite_svg.scss',
              template: "source/styles/global/_sprite_template_svg.scss"
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('build/'));
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

gulp.task('clean-img', function (cb) {
  return rimraf('build/images', cb);
})

/* ------------ Copy system ------------- */

gulp.task('copy:.htaccess', () =>
gulp.src('node_modules/apache-server-configs/dist/.htaccess')
  .pipe(gulp.dest('build'))
);


/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:.htaccess'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('source/js/**/*.js', gulp.series('js'));
  gulp.watch('source/images/*.*', gulp.series('copy:images'));
});

/*------------- default -------------*/
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('sprite-png', 'sprite-svg'),
  gulp.parallel('templates:compile', 'styles:compile','js','libs', 'copy'),
  gulp.parallel('watch', 'server')
  )
);