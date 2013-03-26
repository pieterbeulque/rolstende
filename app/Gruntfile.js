var jspaths = ['src/js-dev/classes/*', 'src/js-dev/app.js'];
var scsspaths = ['src/scss/*.scss', 'src/scss/base/*.scss', 'src/scss/modules/*.scss'];

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: '(function () {\n\n"use strict";\n\n',
                separator: '\n\n',
                footer: '\n\n})();'
            },

            dist: {
                src: jspaths,
                dest: 'src/js/app.js'
            }
        },

        watch: {
            scripts: {
                files: jspaths,
                tasks: ['concat']
            },

            style: {
                files: scsspaths,
                tasks: ['compass:development']
            }
        },

        compass: {
            development: {
                options: {
                    sassDir: 'src/scss',
                    cssDir: 'src/css',
                    environment: 'development'
                }
            },

            production : {
                options: {
                    sassDir: 'src/scss/',
                    cssDir: 'out/css',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            }
        },

        uglify: {
            production: {
                options: {
                    wrap: true
                },
                files: {
                    'out/js/app.js':jspaths
                }
            }
        },

        clean: {
            production: {
                src: ['out/']
            }
        },

        copy: {
            production: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['*.htm', 'images/**', 'js/libs/*'],
                        dest: 'out/'
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'compass:development']);
    grunt.registerTask('production', ['clean:production', 'copy:production', 'uglify:production', 'compass:production']);
};