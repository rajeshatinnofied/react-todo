var gulp = require('gulp'),
    del = require('del'),
    run = require('gulp-run'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    browserSync = require('browser-sync'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reactify = require('reactify'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    stringify = require('stringify'),
    concat = require('gulp-concat');

var paths = {
  env: process.env.NODE_ENV || 'development',
  outputClientDir: process.env.OUTPUT_DIR || 'dist/',
  sass: ['./app/assets/sass/**/*.scss'],
  libJs: [
        'bower_components/react/react.js',
        'bower_components/react/react-dom.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js',
        'bower_components/bootstrap/dist/js/bootstrap.js'
  ],
  js: './app/scripts/app.js',
  libCss: [
        'bower_components/font-awesome/css/font-awesome.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css'
  ],
  indexSrc: 'app/index.html',
  imagesPath: 'app/assets/images/*.*',
  indexSass: './app/assets/sass/app.scss',
  favico: './app/favicon.ico'
};

gulp.task('clean', function(cb) {
  del(['dist/**'], cb);
});

gulp.task('server', function() {
  browserSync({
    server: {
     baseDir: './dist' 
    }
  });
});
gulp.task('sass', function(done) {
  gulp.src(paths.indexSass)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest(paths.outputClientDir+'css/'))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.outputClientDir+'css/'))
    .on('end', done);
});
gulp.task('js', function() {
  return browserify(paths.js)
  .transform(reactify)
  .bundle()
  .pipe(source('app.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(paths.outputClientDir+'js/'));
});

gulp.task('vendorCss', function() {
    return gulp.src(paths.libCss)
        .pipe(cssmin())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(paths.outputClientDir + '/css'));
});
gulp.task('vendorJs', function() {
    return gulp.src(paths.libJs)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(paths.outputClientDir + '/js'));
});
gulp.task('copyIndex', function() {
    return gulp.src(paths.indexSrc)
    .pipe(gulp.dest(paths.outputClientDir));
});
gulp.task('images', function() {
    return gulp.src(paths.imagesPath)
    .pipe(gulp.dest(paths.outputClientDir+'/img'));
});

gulp.task('copyFavico', function() {
    return gulp.src(paths.favico)
    .pipe(gulp.dest(paths.outputClientDir));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js,['js']);
  gulp.watch(paths.libJs, ['vendorJs']);
  gulp.watch(paths.libCss, ['vendorCss']);
  gulp.watch('app/scripts/**/*.jsx', ['js']);
  gulp.watch('app/scripts/**/*.js', ['js']);
  gulp.watch('app/index.html',['copyIndex']);
  gulp.watch('app/images/**/*.*',['copyImages']);
});

gulp.task('build', ['sass','vendorCss','js','vendorJs','copyIndex', 'images', 'copyFavico']);
gulp.task('default', ['build','watch']);
gulp.task('serve',['build','server'], function() {
  return gulp.watch([
    paths.sass, paths.js, paths.libJs, paths.libCss, 
    'app/scripts/**/*.jsx', 'app/scripts/**/*.js', 'app/index.html','app/images/**/*.*'
  ], [
   'build', browserSync.reload
  ]);
});