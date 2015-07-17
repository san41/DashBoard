var gulp  = require('gulp');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");
gulp.task("client-browserify", function(){
  gulp.src('client/index.js')
    .pipe(browserify())
    .on('error', onError)
    .pipe(gulp.dest('client/public/'));
});

gulp.task("settings-browserify", function(){
  gulp.src('client/settings/index.js')
    .pipe(browserify())
    .on('error', onError)
    .pipe(rename('settings.js'))
    .pipe(gulp.dest('client/public/'));
})

function onError(err) {
  console.log(err);
  this.emit('end');
}


gulp.task('default', ['client-browserify', "settings-browserify"], function(){
  gulp.watch(['app.js', '**/*.js', '!public/**/*.js'], ['client-browserify', "settings-browserify"]);
})

gulp.task('no-watch', ['client-browserify', "settings-browserify"]);
