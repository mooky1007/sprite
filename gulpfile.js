import { src, dest, watch } from 'gulp';
import obfuscator from 'gulp-javascript-obfuscator';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const defaultTask = (cb) => {
    browserify({
        entries: './src/js/sprite.js',
        debug: true,
    })
        .transform(babelify, { presets: ['@babel/preset-env'] })
        .bundle()
        .pipe(source('sprite.js'))
        .pipe(buffer())
        .pipe(
            obfuscator({
                compact: true,
                controlFlowFlattening: true,
                deadCodeInjection: true,
                debugProtection: false,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                numbersToExpressions: true,
                renameGlobals: false,
                rotateStringArray: true,
                selfDefending: true,
                simplify: true,
                splitStrings: true,
                splitStringsChunkLength: 5,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                transformSyntax: true,
                unicodeEscapeSequence: true,
            })
        )
        .pipe(dest('dist/js'));
    cb();
};

watch(['src/**/**/*'], defaultTask);

export default defaultTask;
