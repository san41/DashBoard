var gulp  = require('gulp');
var browserify = require('gulp-browserify');

gulp.task("client-browserify", function(){
  gulp.src('client/index.js')
    .pipe(browserify())
    .pipe(gulp.dest('client/public/'));
})


gulp.task('default', ['client-browserify'], function(){
  gulp.watch(['app.js', '**/*.js', '!public/**/*.js'], ['client-browserify']);
})

