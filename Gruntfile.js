'use strict';

module.exports = function(grunt) {
  var serverSide = ['Gruntfile.js', 'lib/**/*.js', 'test/auth_test.js',
                    'test/rest_api_test.js'];
  var clientSide = ['app/**/*.js', 'test/karma_tests/*.js'];
  var allSource = serverSide + clientSide;

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
        },
        src: serverSide
      }
    }, //end mochaTest

    jshint: {
      server: {
        src: serverSide
      },
      client: {
        src: clientSide
      },
      options: {
        jshintrc: '.jshintrc'
      }
    }, //end jshint

    watch: {
      files: allSource + ['app/**/*.html'],
      tasks: ['test']
    }, //end watch

    jscs: {
      server: {
        src: serverSide,
        options: {
          config: '.jscsrc'
        }
      },
      client: {
        src: clientSide,
        options: {
          config: '.jscsrc'
        }
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
      karmaTest: {
        entry: './test/karma_tests/karma_entry.js',
        output: {
          path: './test/karma_tests/',
          filename: 'karma_test_bundle.js'
        }
      }
    },

    karma: {
      test: {
        configFile: 'karma.conf.js'
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
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('karmatest', ['webpack:karmaTest', 'karma:test']);
  grunt.registerTask('build:dev', ['webpack:client', 'copy:html']);
  grunt.registerTask('build:test', ['webpack:test']);
  grunt.registerTask('servertest', ['jshint:server',
                                    'mochaTest', 'jscs:server']);
  //grunt.registerTask('default', ['test']);
};
