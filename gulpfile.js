var url = require('url');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var del = require('del');
var concat = require('gulp-concat');
var maps   = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var es = require('event-stream');
var proxy = require('proxy-middleware');
var browserSync = require('browser-sync');
var karmaServer = require('karma').Server;
var ngHtml2Js = require("gulp-ng-html2js");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var zip = require('gulp-zip');
var info = require('./package.json');
var ts = require('gulp-typescript');
var debug = require('gulp-debug');
var tsConfig = require("tsconfig-glob");
var tslint = require("gulp-tslint");


var external = [
    'node_modules/angular/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/soocss/js/soocss.js'
];

gulp.task('clean', function () {
  return del(['build', 'dist', 'coverage']);
});

gulp.task('lint', ['clean'], function () {
  var sources = [
    'src/**/*.ts',
    'test/**/*.js'
  ];

  return gulp.src(sources)
    .pipe(tslint())
    .pipe(tslint.report('verbose', {
        emitError: false
      }));
});

gulp.task('scripts', ['lint', 'tsconfig-glob'], function () {

    var tsProject = ts.createProject('tsconfig.json', {sortOutput: true});

    var vendorStream = gulp.src(external)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('build'));

    var TsStream = tsProject.src()
        .pipe(maps.init())
        .pipe(ts(tsProject));
        //.pipe(debug(ts(tsProject)));

        //.pipe(concat('app.js'))
    var appStream = TsStream
        //.pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('build'));

    var htmlStream = gulp.src('src/**/*.html')
        .pipe(ngHtml2Js({
                moduleName: 'partials'
            }))
        .pipe(concat('partials.js'))
        .pipe(gulp.dest('build'));

    var iconsStream = gulp.src('src/icons/**/*.svg')
        .pipe(ngHtml2Js({
            moduleName: 'soocss-icons'
        }))
        .pipe(concat('partials-icons.js'))
        .pipe(gulp.dest('build'));

    var cssStream = gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('build'));

    gulp.src(['src/assets/**/*']).pipe(gulp.dest('build/assets'));

    return gulp.src('templates/index.html')
      .pipe(inject(es.merge(vendorStream, htmlStream, iconsStream, appStream, cssStream), {ignorePath: 'build'}))
      .pipe(gulp.dest('build'));
});

gulp.task('watch', ['tsconfig-glob', 'scripts'], browserSync.reload);

gulp.task('browser-sync', ['test'], function() {
    var proxyOptions = url.parse('http://localhost:3000/secret-api');
    proxyOptions.route = '/api';
    // requests to `/api/x/y/z` are proxied to `http://localhost:3000/secret-api`

    browserSync({
        open: true,
        port: 3000,
        server: {
            baseDir: 'build',
            middleware: [proxy(proxyOptions)]
        }
    });

    gulp.watch(['src/**/*.ts',
        'src/scss/**/*.scss',
        'src/**/*.html'], ['watch']);
});

gulp.task('tsconfig-glob', function () {
    return tsConfig({
        configPath: '.',
        cwd: process.cwd(),
        indent: 2
    });
});

gulp.task('zip', ['test'], function () {
    var filename = info.name + '-' + info.version + '.zip';
    return gulp.src(['build/*', '!build/*.map'])
        .pipe(zip(filename))
        .pipe(gulp.dest('dist'));
});

gulp.task('test', ['scripts'], function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('dev', ['scripts', 'test', 'browser-sync']);
gulp.task('release', ['scripts', 'test', 'zip']);
