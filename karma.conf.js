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
            'karma-typescript-preprocessor'
        ],
        files: [
            'build/vendor.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'build/app.js',
            'test/**/*.ts'
        ],
    exclude: [
    ],
    preprocessors: {
      'src/**/*.ts': 'coverage',
      'test/**/*.ts': 'typescript'
    },
    typescriptPreprocessor: {
       options: {
           sourceMap: false,
           target: 'ES5',
           module: 'commonjs',
           noImplicitAny: true,
           noResolve: true,
           removeComments: true,
           concatinateOutput: false
       },
       typings: [ 'typings/index.d.ts' ],
       transformPath: function (path) {
           return path.replace(/\.ts$/, '.js');
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
