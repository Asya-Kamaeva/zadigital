const { src, dest, task, series, watch, parallel } = require("gulp");

const rm = require('gulp-rm'); //плагин для очистки папки dist
const sass = require('gulp-sass'); //компилирует sass идет вместе с node-sass
sass.compiler = require('node-sass'); //компилирует sass
const concat = require('gulp-concat'); //склеивает файлы
const browserSync = require('browser-sync').create(); //запуск dev сервера
const reload = browserSync.reload; //запуск dev сервера,перезагрузка
const sassGlob = require('gulp-sass-glob'); //групповой импорт scss-файлов
const pug = require('gulp-pug'); //компилятор pug
// const autoprefixer = require('gulp-autoprefixer'); //простановка автопрефиксов
const gcmq = require('gulp-group-css-media-queries'); //объединение медиа запросов для уменьшения объема css
const cleanCSS = require('gulp-clean-css'); //чистит css от мусора и дублирующихся правил
const sourcemaps = require('gulp-sourcemaps'); //карта исходных css файлов, исп.для удобства разработки
const babel = require('gulp-babel'); //преобразует JS код под старые браузеры
const uglify = require('gulp-uglify'); //минификация JS
const imagemin = require('gulp-imagemin'); //минификация img
const gulpif = require('gulp-if'); //позволяет подключать разные плагины, в зависимости от состояния dev (разработка) / prod (готов к продакшену)
const env = process.env.NODE_ENV; //переменная для сохранения состояниия проектам dev или prod

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/css/style.scss'
];

const scripts = [
    'src/scripts/*.js',
    'src/scripts/**/**/*.js'
];

task('clean', () => {
    return src('dist/**/*', { read: false })
        .pipe(rm())
})

   
task('pug', () => {
    return src('src/pug/**')
        .pipe(pug())
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
  });

task('copy:img', () => {
    return src('src/img/**/*.*')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
        .pipe(reload({ stream: true }));
})

task('copy:fonts', () => {
    return src('src/fonts/*.*')
        .pipe(dest('dist/fonts'))
        .pipe(reload({ stream: true }));
})


task('styles', () => {
    return src(styles)
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat('style.scss'))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        // .pipe(gulpif(env === 'prod', autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // })))
        .pipe(gulpif(env === 'prod', gcmq()))
        .pipe(gulpif(env === 'prod', cleanCSS()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
});

task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

task('scripts', () => {
    return src(scripts)
        .pipe(gulpif(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.js', { newLine: ';' }))
        .pipe(gulpif(env === 'prod', babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpif(env === 'prod', uglify()))
        .pipe(gulpif(env === 'dev', sourcemaps.write()))
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
});

task('watch', () => {
    watch('./src/css/**/*.scss', series('styles'));
    watch('./src/pug/*.pug', series('pug'));
    watch('./src/pug/**/*.pug', series('pug'));
    watch('./src/scripts/*.js', series('scripts'));

});

task('default',
    series('clean',
        parallel('pug', 'styles', 'scripts', 'copy:fonts', 'copy:img'),
        parallel('watch', 'server')
    )
);

task('build',
    series('clean',
        parallel('pug', 'styles', 'scripts', 'copy:fonts', 'copy:img'),
        parallel('watch', 'server')
    )
);

const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});