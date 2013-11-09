module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', './*.js', 'test/*.js'],
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'cafemocha']
    },
    cafemocha: {
      tests: {
        src: 'test/**/*.js',
        options: {
            reporter: 'spec',
            growl: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-cafe-mocha');

  grunt.registerTask('default', ['jshint', 'cafemocha']);
};