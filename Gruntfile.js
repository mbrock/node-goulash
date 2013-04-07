module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      files: ['test/**/*.test.js'],
    },

    mochaTestConfig: {
      options: {
        reporter: 'spec'
      }
    },

    cucumberjs: {
      files: 'spec/features',
      options: {
        steps: 'spec/steps',
        format: 'pretty'
      }
    },

    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      build: {
        files: {
          'static/app.min.js': ['src/**/*.js', 'build/templates.js']
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'Goulash.Templates'
        },
        files: {
          'build/templates.js': 'src/templates/**/*.hbs'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-cucumber');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.registerTask('default', [
    'handlebars', 'uglify', 'mochaTest', 'cucumberjs']);
};
        
