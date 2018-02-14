var gulp = require('gulp'); // Сообственно Gulp JS
var bootstrap = require('bootstrap-styl');
var stylus = require('gulp-stylus');

// "темная" тема
gulp.task('theme-dark', function(){
    gulp.src('./styles/theme-dark.styl')
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(stylus({ use: bootstrap(), compress: true, 'include css': true }))
        .pipe(gulp.dest('./public/css/themes'));
});

// "зеленая" тема
gulp.task('theme-green', function(){
    gulp.src('./styles/theme-green.styl')
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(stylus({ use: bootstrap(), compress: true, 'include css': true }))
        .pipe(gulp.dest('./public/css/themes'));
});

//gulp.task('build', ['theme-dark']);