/* global module: true */
module.exports = function (grunt) {
  "use strict";

  var hintFiles = [
    "Gruntfile.js",
    "src/**/*.js",
    "test/**/*.js",
    "package.json"
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      files: hintFiles,
      tasks: ["test"]
    },
    jshint: {
      files: hintFiles,
      options: {
        jshintrc: true
      }
    },
    jsbeautifier: {
      "write": {
        src: hintFiles,
        options: {
          config: ".jsbeautifyrc"
        }
      },
      "verify": {
        src: hintFiles,
        options: {
          config: ".jsbeautifyrc",
          mode: "VERIFY_ONLY"
        }
      }
    },
    jasmine: {
      pivotal: {
        src: ["src/gurps.js", "src/**/*.js"],
        options: {
          specs: "test/**/*.js"
        }
      }
    }
  });
  // load up your plugins
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-jasmine");

  // register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask("test", ["jasmine"]);
  grunt.registerTask("hint", ["jshint"]);
  grunt.registerTask("format", ["jsbeautifier:write", "jshint"]);
  grunt.registerTask("verify", ["jsbeautifier:verify", "jshint"]);
  grunt.registerTask("dev", ["default", "watch"]);
  grunt.registerTask("default", ["verify", "test"]);
};
