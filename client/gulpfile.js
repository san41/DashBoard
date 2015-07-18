var gulp  = require('gulp');
var browserify = require('gulp-browserify');

gulp.task("browserify", function(){
  gulp.src('app.js')
    .pipe(browserify())
    .on('error', onError)
    .pipe(gulp.dest('static/js'));
});

function onError(err) {
  console.error(err);
  this.emit('end');
}

gulp.task('default', ['browserify'], function(){
  gulp.watch(['app.js', '**/*.js', '!static/js/app.js'], ['browserify']);
})

