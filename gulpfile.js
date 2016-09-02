// Main dependencies and plugins
let gulp = require('gulp');
//let jshint = require('gulp-jshint');
let rename = require('gulp-rename');
let concat = require('gulp-concat');
let htmlMin = require('gulp-htmlmin');
let uglify = require('gulp-uglify');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer')
let cleanCss = require('gulp-clean-css');
let nodemon = require('gulp-nodemon');
//let exec = require('child_process').exec;

let paths = {
    source: {
        markup: "source/*.html",
        scripts: "source/scripts/**/*.js",
        styles: "source/styles/main.scss"
    },
    output: "public"
}

// linting
//gulp.task('lint', () => {
//    return gulp.src(assets)
//        .pipe(jshint())
//        .pipe(jshint.reporter('jshint-stylish'));
//});

gulp.task('markup', () => {
    return gulp.src(paths.source.markup)
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.output));
});

// concatentate + minify scripts
gulp.task('scripts', () => {
    return gulp.src(paths.source.scripts)
        .pipe(concat('global.js'))
        .pipe(gulp.dest(paths.output))
        .pipe(uglify())
        .pipe(rename('global.min.js'))
        .pipe(gulp.dest(paths.output));
});

// concatenate + minify styles
gulp.task('styles', () => {
    return gulp.src(paths.source.styles)
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer())
        //.pipe(concat('main.css'))
        .pipe(rename('main.css'))
        .pipe(gulp.dest(paths.output))
        .pipe(cleanCss())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(paths.output));
});

// watch for changes
gulp.task('watch', () => {
    gulp.watch(paths.source.markup, ['markup']);
    gulp.watch(paths.source.scripts, ['scripts']);
    gulp.watch(paths.source.styles, ['styles']);
});

gulp.task('server', () => {
    nodemon({
        script: 'app/server.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    })
        .on('start', ['watch'])
        //.on('change', ['watch'])
        .on('restart', () => {
            console.log('restarted');
        });
});

gulp.task('default', ['server']);
gulp.task('build', ['markup', 'scripts', 'styles']);