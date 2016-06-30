module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'sinon-chai'],
        browsers: ['PhantomJS'],
        plugins: [
            'karma-mocha',
            'karma-sinon-chai',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-babel-preprocessor'
        ],
        files: [
            'build/vendor.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'build/app.js',
            'test/**/*.js'
        ],
    exclude: [
    ],
    preprocessors: {
      'src/**/*.js': 'coverage',
      'test/**/*.js': 'babel'
    },
    babelPreprocessor: {
        options: {
            presets: ['es2015'],
            sourceMap: 'inline'
        }
    },
    reporters: ['dots','junit','coverage'],
    port: 9876,
    colors: true,
    //logLevel: config.LOG_DEBUG,
    logLevel: config.LOG_INFO,
    singleRun: true,
    junitReporter: {
      outputDir: '.',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  });
};
