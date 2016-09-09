// Main dependencies and plugins
let gulp = require('gulp');
//let jshint = require('gulp-jshint');
let rename = require('gulp-rename');
let concat = require('gulp-concat');
let htmlMin = require('gulp-htmlmin');
let uglify = require('uglify-js-harmony');
let minifier = require('gulp-uglify/minifier');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer')
let cleanCss = require('gulp-clean-css');
let nodemon = require('gulp-nodemon');
let del = require('del');
//let exec = require('child_process').exec;

let paths = {
    source: {
        markup: "source/*.html",
        scripts: "source/scripts/**/*.js",
        styles: "source/styles/global.scss",
        images: "source/images/**/*"
    },
    output: "public"
}

// remove old build
gulp.task('clean', () => {
    return del(['public/**/*']);
})
// compile and minify markup
gulp.task('markup', () => {
    return gulp.src(paths.source.markup)
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.output));
});

// concatentate + minify scripts
gulp.task('scripts', (cb) => {
//    return gulp.src(paths.source.scripts)
//        .pipe(concat('global.js'))
//        .pipe(gulp.dest(paths.output))
//        .pipe(minifier({}, uglify))
//        .pipe(rename('global.min.js'))
//        .pipe(gulp.dest(paths.output));
    pump([
        gulp.src(paths.source.scripts),
        minifier(options, uglifyjs),
        gulp.dest(paths.output)
    ], cb);
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

// copy images to output directory
gulp.task('images', () => {
    return gulp.src(paths.source.images)
        .pipe(gulp.dest(`${paths.output}/images`));
});

// watch for changes
gulp.task('watch', () => {
    gulp.watch(paths.source.markup, ['markup']);
    gulp.watch(paths.source.scripts, ['scripts']);
    gulp.watch(paths.source.styles, ['styles']);
    gulp.watch(paths.source.images, ['images']);
});

// serve and watch for changes
gulp.task('server', () => {
    nodemon({
        script: 'app/server.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    })
        .on('start', ['build', 'watch'])
        .on('restart', () => {
            console.log('restarted');
        });
});

// task aliases
gulp.task('default', ['server']);
gulp.task('build', ['clean', 'markup', 'scripts', 'styles', 'images']);
