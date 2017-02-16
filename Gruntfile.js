/*
 * grunt-cdn-upyun
 * https://github.com/xiaoenai/grunt-cdn-upyun
 *
 * Copyright (c) 2016 Longbo Ma
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function (grunt) {
  var mozjpeg = require('imagemin-mozjpeg')
  var lrPort = 35729

  var lrSnippet = require('connect-livereload')({ port: lrPort })

  var lrMiddleware = function (connect, options) {
    return [
      // 把脚本，注入到静态文件中
      lrSnippet,
      // 静态文件服务器的路径
      connect.static(options.base[0]),
      // 启用目录浏览(相当于IIS中的目录浏览)
      connect.directory(options.base[0])
    ]
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    path: {
      dest: 'dest/',
      dev: 'src/'
    },
    // jshint: {
    //   all: [
    //     'Gruntfile.js',
    //     'tasks/*.js'
    //   ],
    //   options: {
    //     jshintrc: '.jshintrc'
    //   }
    // },

    uglify: {
      build: {
        src: '<%= path.dev %>assets/js/**.js',
        dest: '<%= path.dest %>assets/js/app.min.js'
      }
    },

    sass: {
      dist: {
        // files: [
        //   {
        //     expand: true,
        //     cwd: 'styles',
        //     src: ['src/assets/scss/app.scss'],
        //     dest: 'dest/assets/css/',
        //     ext: '.css'
        //   }
        // ]
        options: {
          style: 'compressed',
          compass: true
        },
        files: {
          // '<%= path.dest %>assets/css/app.css': '<%= path.dev %>assets/scss/app.scss',
          // '<%= path.dest %>assets/css/mobile.css': '<%= path.dev %>assets/scss/mobile.scss',
          // '<%= path.dest %>assets/css/goddess.css': '<%= path.dev %>assets/scss/goddess.scss',
          // '<%= path.dest %>assets/css/goddess_mobile.css': '<%= path.dev %>assets/scss/goddess_mobile.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          // '<%= path.dest %>assets/css/app.css': '<%= path.dev %>assets/scss/app.scss',
          // '<%= path.dest %>assets/css/mobile.css': '<%= path.dev %>assets/scss/mobile.scss',
          // '<%= path.dest %>assets/css/goddess.css': '<%= path.dev %>assets/scss/goddess.scss',
          // '<%= path.dest %>assets/css/goddess_mobile.css': '<%= path.dev %>assets/scss/goddess_mobile.scss'
        }
      }
    },

    // compass: {
    //    dest: {
    //     options: {
    //      config: 'config.rb'
    //     }
    //   }
    // },

    copy: {
      html: {
        flatten: true,
        expand: true,
        src: '<%= path.dev %>views/*.html',
        dest: '<%= path.dest %>/'
      },
      icons: {
        files: [
          {
            flatten: true,
            expand: true,
            src: ['<%= path.dev %>assets/img/*.png'],
            dest: '<%= path.dest %>assets/img/'
          },
          // {
          //   flatten: true,
          //   expand: true,
          //   src: ['<%= path.dev %>assets/img/goddess/*.jpg', '<%= path.dev %>assets/img/goddess/*.png'],
          //   dest: '<%= path.dest %>assets/img/goddess/'
          // }
        ]
      },
      libs: {
        flatten: true,
        expand: true,
        src: '<%= path.dev %>libs/*.js',
        dest: '<%= path.dest %>libs/'
      },
      fonts: {
        flatten: true,
        expand: true,
        src: '<%= path.dev %>assets/font/**',
        dest: '<%= path.dest %>assets/font/'
      }
    },

    clean: {
      folder: ['dest/']
    },

    watch: {
      scripts: {
        files: '<%= path.dev %>assets/js/*.js',
        tasks: ['uglify'],
        options: {
          livereload: true
        }
      },
      html: {
        files: '<%= path.dev %>views/*.html',
        tasks: ['copy:html'],
        options: {
          livereload: true
        }
      },
      css: {
        files: '<%= path.dev %>assets/scss/**.scss',
        tasks: ['sass:dist'],
        options: {
          livereload: true
        }
      },
      icons: {
        files: '<%= path.dev %>assets/img/icons/*.png',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      autoprefixer: {
        files: ['<%= path.dest %>assets/css/app.css', '<%= path.dest %>assets/css/mobile.css', '<%= path.dest %>assets/css/goddess.css', '<%= path.dest %>assets/css/goddess_mobile.css'],
        task: ['autoprefixer:dist'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 2017,
          base: '.',
          livereload: true,
          hostname: '0.0.0.0'
        }
      }
    },

    autoprefixer: {
      options: {
        browers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      dist: {
        files: {
          '<%= path.dest %>assets/css/app.css': '<%= path.dest %>assets/css/app.css',
          '<%= path.dest %>assets/css/mobile.css': '<%= path.dest %>assets/css/mobile.css',
          '<%= path.dest %>assets/css/goddess.css': '<%= path.dest %>assets/css/goddess.css',
          '<%= path.dest %>assets/css/goddess_mobile.css': '<%= path.dest %>assets/css/goddess_mobile.css'
        }
      }
    },

    rev: {
      options: {
        encoding: 'utf-8',
        algorithm: 'md5',
        length: 8
      },
      images_fonts: {
        files: [ {
          src: [
            '<%= path.dest %>assets/img/*.png',
            '<%= path.dest %>assets/img/goddess/*.png',
            '<%= path.dest %>assets/img/goddess/*.jpg'
          ]
        }]
      },
      css: {
        files: [{
          src: [
            '<%= path.dest %>assets/css/*.css'
          ]
        }]
      },
      js: {
        files: [{
          src: [
            '<%= path.dest %>assets/js/*.js'
          ]
        }]
      }
    },

    usemin: {
      css: {
        files: {
          src: [
            '<%= path.dest %>assets/css/*.css'
          ]
        }
      },
      html: '<%= path.dest %>/*.html',
      js: '<%= path.dest %>assets/js/*.js',
      options: {
        assetDirs: ['<%= path.dest %>', '<%= path.dest %>assets/css/']
      }
    },

    replace: {
      dist: {
        src: ['<%= path.dest %>assets/css/*.css'],
        overwrite: true,
        // dest: 'dest/',
        replacements: [
          {
            from: '../../src/assets/',
            to: ''
          }
        ]
      }
    },

    imagemin: {
      dest: {
        files: [{
          expand: true,
          cwd: 'dest/assets/img/',
          src: ['*.{png,jpg,gif}'],
          dest: 'dest/assets/img/'
        }]
      }
    },

    'font-spider': {
      options: {
        backup: false,
        ignore: ['\\.woff2$']
      },
      main: {
        src: './dest/**/*.html'
      }
    }
  })

  // Actually load this plugin's task(s).
  // grunt.loadTasks( 'tasks' )

  // These plugins provide necessary tasks.
  // grunt.loadNpmTasks( 'grunt-contrib-jshint' )
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-autoprefixer')
  grunt.loadNpmTasks('grunt-rev')
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-text-replace')
  grunt.loadNpmTasks('grunt-contrib-imagemin')
  grunt.loadNpmTasks('grunt-base-tag')
  grunt.loadNpmTasks('grunt-enai-upyun')
  grunt.loadNpmTasks('grunt-cdn')
  grunt.loadNpmTasks('grunt-font-spider');

  // By default, lint and run all tests.

  grunt.registerTask('default', [
    'clean',
    'copy',
    'uglify'
  ])

  grunt.registerTask('clear', [
    'clean'
  ])

  grunt.registerTask('build', [
    'clean',
    'copy',
    'font-spider',
    'uglify',
    'sass:dist',
    'autoprefixer:dist',
    'copy:icons',
    'replace:dist',
    'rev',
    'usemin',
    'font-spider',
    'imagemin'
  ])

  grunt.registerTask('server', [
    'clean',
    'copy',
    'font-spider',
    'uglify',
    'sass:dev',
    'autoprefixer:dist',
    'copy:icons',
    'font-spider',
    'connect',
    'watch'
  ])
}
