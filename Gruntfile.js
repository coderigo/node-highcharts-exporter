'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        jshint : {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js', 
                'example/*.js', 
                'lib/node-highcharts-exporter/*.js'
            ]
        },
        jasmine_node : {
            projectRoot : ".",
            requirejs   : false,
            forceExit   : true,
            jUnit       : {
                report   : false,
                savePath : "./build/reports/jasmine/",
                useDotNotation : true,
                consolidate    : true
            }
        }
    });

    // Load all NPM tasks
    ['grunt-contrib-jshint','grunt-jasmine-node'].forEach(function(task){
        grunt.loadNpmTasks(task);
    });

    // Specify task order and that
    grunt.registerTask('test', ['jshint', 'jasmine_node']);
};