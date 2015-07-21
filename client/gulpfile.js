var gulp  = require('gulp');
var browserify = require('gulp-browserify');
var _ = require('underscore');
var shell = require('gulp-shell')
var concat = require('gulp-concat')
var File = require('vinyl');
var fs = require('fs');
var path = require('path');
var gettext = require('gulp-angular-gettext');
var brfs = require('gulp-brfs');


var localesLanguages = ['en-US', 'fr-FR'];


gulp.task("browserify", function(){
  gulp.src('app.js')
  .pipe(brfs())
  .pipe(browserify())
  .on('error', onError)
  .pipe(gulp.dest('static/js'));
});

gulp.task('gettext-extract', function(){
  var localesPath  = path.join(__dirname, '..', 'locales');
  if(!fs.existsSync(localesPath))
    fs.mkdirSync(localesPath);

    var cmd = "../node_modules/.bin/jsxgettext -j -L ejs -o ../locales/app.pot <%= file.path %>";

    gulp.src('**/*.ejs')
    .on('error', onError)
    .pipe(shell(cmd,{
      templateData: {
        basename: function (file) {
          var f = new File({path:file.path});
          return f.basename.replace(f.extname,'');

        }
      }
    }));
})

gulp.task('pot', function () {
  return gulp.src(['views/**/*.html'])//, '**/*.js'])
  .pipe(gettext.extract('app.pot', {}))
  .on('error', onError)
  .pipe(gulp.dest('../locales/'));
});

gulp.task('translations', function () {
  return gulp.src('../locales/**/*.po')
  .on('error', onError)
  .pipe(gettext.compile({
    module: 'dbapp'
  }))
  .pipe(concat('all.js'))
  .pipe(gulp.dest('../locales/translations/'));
});

function onError(err) {
  console.error(err);
  this.emit('end');
}

gulp.task('default', ['no-watch'], function(){
  gulp.watch(['app.js', '**/*.js', '!gulpfile.js','!static/js/app.js'], ['browserify']);
  gulp.watch(['**/*.ejs'], ['gettext-extract']);
  gulp.watch(['views/**/*.html'], ['pot']);
  gulp.watch(['../locales/**/*.po'], ['translations']);
})


gulp.task('no-watch', ['gettext-extract', 'pot', 'translations', 'browserify'])
