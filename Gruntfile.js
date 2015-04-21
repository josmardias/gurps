/* jshint camelcase: false */
module.exports = function (grunt) {
  "use strict";

  var hintFiles = [
    "bower.json",
    "Gruntfile.js",
    "package.json",
    ".jshintrc",
    ".jsbeautifyrc",
    "src/**/*.js",
    "src/.jshintrc",
    "test/**/*.js",
    "test/.jshintrc",
    "karma/**/*.js",
  ];

  var config = {};

  config.pkg = grunt.file.readJSON("package.json");

  /* Watch
   * https://github.com/gruntjs/grunt-contrib-watch
   ----------------------------------------------------------------------- */

  config.watch = {};

  config.watch.files = hintFiles;

  config.watch.tasks = ["test"];

  /* JSHint
   * https://github.com/gruntjs/grunt-contrib-jshint
   ----------------------------------------------------------------------- */

  config.jshint = {};

  config.jshint.files = hintFiles;

  config.jshint.options = {
    extensions: ".js, .jshintrc, .jsbeautifyrc",
    jshintrc: true
  };

  /* JS Beautifier
   * https://github.com/vkadam/grunt-jsbeautifier
   ----------------------------------------------------------------------- */

  config.jsbeautifier = {};

  config.jsbeautifier.write = {
    src: hintFiles,
    options: {
      config: ".jsbeautifyrc"
    }
  };

  config.jsbeautifier.verify = {
    src: hintFiles,
    options: {
      config: ".jsbeautifyrc",
      mode: "VERIFY_ONLY"
    }
  };

  /* Browserify
   * https://github.com/jmreidy/grunt-browserify
   ----------------------------------------------------------------------- */

  config.browserify = {};

  config.browserify.options = {
    debug: true
  };

  config.browserify.src = {
    src: "./src/gurps.js",
    dest: "./build/src-bundle.js"
  };

  config.browserify.test = {
    options: {
      external: ["./src/**/*.js"],
    },
    src: "./tests/**/*.js",
    dest: "./build/test-bundle.js"
  };

  /* Jasmine Node
   * https://github.com/jribble/grunt-jasmine-node-coverage
   ----------------------------------------------------------------------- */

  config.jasmine_node = {};

  config.jasmine_node.test = {
    options: {
      captureExceptions: true,
      coverage: false,
      forceExit: true,
      isVerbose: false,
      specFolders: ["tests"],
      showColors: true
    },
    src: ["src/**/*.js"]
  };

  config.jasmine_node.coverage = {
    options: {
      captureExceptions: true,
      coverage: {
        print: "none", // none, summary, detail, both
        reportDir: "coverage",
        report: ["lcov"]
      },
      forceExit: true,
      isVerbose: false,
      specFolders: ["tests"],
      showColors: true
    },
    src: ["src/**/*.js"]
  };

  /* Clean
   * https://github.com/gruntjs/grunt-contrib-clean
   ----------------------------------------------------------------------- */

  config.clean = {};

  config.clean.build = ["lib"];

  /* Karma
   * https://github.com/karma-runner/grunt-karma
   ----------------------------------------------------------------------- */

  config.karma = {};

  config.karma.options = {
    basePath: "..", //default is configFile path
    files: ["build/src-bundle.js", "build/test-bundle.js"],
    frameworks: ["jasmine"]
  };

  config.karma.browserstack = {
    configFile: "karma/browserstack.conf.js"
  };

  config.karma.browsers = {
    configFile: "karma/browsers.conf.js"
  };

  config.karma.debug = {
    configFile: "karma/debug.conf.js"
  };

  config.karma.test = {
    configFile: "karma/test.conf.js"
  };

  config.karma.coverage = {
    configFile: "karma/coverage.conf.js"
  };

  /*
   * Configuration
   ----------------------------------------------------------------------- */

  grunt.initConfig(config);

  var taskList = [
    "grunt-contrib-watch",
    "grunt-contrib-jshint",
    "grunt-contrib-clean",
    "grunt-browserify",
    "grunt-jsbeautifier",
    "grunt-jasmine-node-coverage",
    "grunt-karma",
  ];

  taskList.forEach(grunt.loadNpmTasks);

  /*
   * Tasks
   ----------------------------------------------------------------------- */

  function task (name, tasks) {
    grunt.registerTask(name, tasks);
  }

  //code quality
  task("lint", ["jshint"]);
  task("format", ["jshint", "jsbeautifier:write"]);
  task("verify", ["jshint", "jsbeautifier:verify"]);

  //test
  task("test", ["jasmine_node:test"]);
  task("coverage", ["jasmine_node:coverage"]); //travis.sh
  task("browserstack", ["browser-test-bundle", "karma:browserstack"]); // travis.sh
  task("browsers", ["browser-test-bundle", "karma:browsers"]);

  //build
  task("browser-bundle", ["browserify:src"]);
  task("browser-test-bundle", ["browserify:src", "browserify:test"]);
  //task("clean", ["clean:build"]);

  //develop
  task("default", ["test", "lint"]);
  task("dev", ["default", "watch"]);
  task("debug", ["browser-test-bundle", "karma:debug"]);

};
