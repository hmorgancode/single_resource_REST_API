'use strict';

module.exports = function(grunt) {
  var srcFiles = ['Gruntfile.js', 'lib/**/*.js', 'app/**/*.js',
                  'test/**/!(test_bundle).js'];

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
        },
        src: ['test/**/*.js']
      }
    }, //end mochaTest

    jshint: {
      all: {
        src: srcFiles
      },
      options: {
        jshintrc: '.jshintrc'
      }
    }, //end jshint

    watch: {
      files: srcFiles,
      tasks: ['test']
    }, //end watch

    jscs: {
      src: srcFiles,
      options: {
        config: '.jscsrc'
      }
    }, //end jscs

    webpack: {
      client: {
        entry: './app/js/client.js',
        output: {
          path: 'build/',
          filename: 'bundle.js'
        }
      },
      test: {
        entry: './test/client/test.js',
        output: {
          path: 'test/client/',
          filename: 'test_bundle.js'
        }
      },
      karma_test: {
        entry: './test/karma_tests/karma_entry.js',
        output: {
          path: './test/karma_tests/',
          filename: 'karma_test_bundle.js'
        }
      }
    },

    copy: {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      }
    },

    clean: {
      dev: {
        src: 'build/'
      }
    }
  });//end grunt.initConfig

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch'); //run with 'grunt watch'
  grunt.loadNpmTasks('grunt-jscs'); //run with 'grunt jscs'
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build:dev', ['webpack:client', 'copy:html']);
  grunt.registerTask('build:test', ['webpack:test']);
  grunt.registerTask('test', ['jshint:all', 'mochaTest', 'jscs']);
  grunt.registerTask('default', ['test']);
};
