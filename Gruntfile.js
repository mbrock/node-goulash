module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.registerTask('default', ['handlebars', 'uglify']);
};
        
