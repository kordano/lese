module.exports = function(grunt) {
  "use strict";
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      all: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          bases: [__dirname + "/public", __dirname + "/bower_components"]
        }
      }
    },
    concat: {
      dist :{
        src: [
          'src/*.js',
          'src/libs/*.js'
        ],
        dest: 'public/js/lese.js'
      }
    },
    uglify: {
      build: {
        src: "public/js/lese.js",
        dest: "public/js/lese.min.js"
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/global.css': 'src/style.scss'
        }
      }
    },
     browserify: {
      'public/js/lese.js': ['public/js/global.js']
     },
    watch: {
      scripts: {
        files: ["src/*.js"],
        tasks: ['concat'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      css: {
        files: ['src/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.registerTask('default', ['concat', 'uglify', 'sass']);
  grunt.registerTask('dev', ['express', 'watch']);
};
