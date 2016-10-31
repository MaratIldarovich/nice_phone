var gulp = require('gulp');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    return gulp.src('nice.js')
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/'))
});