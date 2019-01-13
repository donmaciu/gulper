var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var exorcist = require('exorcist');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var ifElse = require('gulp-if-else');

watchify.args.debug = true;

var sync = browserSync.create();

// Input file.
var bundler = browserify('src/App.js', {
    extensions: ['.js', '.jsx'],
    debug: true
});

// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'src',
    presets: ["es2015", "react", "stage-3"]
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {
    return bundler.bundle()
        .on('error', function (err) {
            console.log("=====");
            console.error(err.toString());
            console.log("=====");
            this.emit("end");
        })
        .pipe(exorcist('public/assets/js/bundle.js.map'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(ifElse(process.env.NODE_ENV === 'production', uglify))
        //.pipe(uglify())
        .pipe(gulp.dest('public/assets/js'))
    ;
}

gulp.task('default', ['transpile']);

gulp.task('transpile', ['lint'], () => bundle());

gulp.task('lint', () => {
    return gulp.src([
            'src/**/*.jsx',
            'gulpfile.babel.js'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
    ;
});

gulp.task('serve', ['transpile'], () => sync.init({ server: 'public' }));
gulp.task('js-watch', ['transpile'], () => sync.reload());

gulp.task('watch-op', () => {
    gulp.watch('src/**/*.js', ['transpile'])
})

gulp.task('watch', ['serve'], () => {
    gulp.watch(['src/**/*.js'], ['js-watch']);
    gulp.watch('public/assets/style.css', sync.reload);
    gulp.watch('public/index.html', sync.reload);
});