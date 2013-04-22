'use strict';
module.exports = function (grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		connect: {
			options: {
				port: 9001,
				base: 'tmp',
				keepalive: false
			},
			test: {
				options: {
					keepalive: false
				}
			},
			server: {
				options: {
					keepalive: true
				}
			}
		},
		compress: {
			component: {
				options: {
					archive: 'tmp/component.zip',
					mode: 'zip'
				},
				files: [
					{
						expand: true,
						cwd: 'test/fixtures/component/',
						src: '**',
						dest: 'component/',
					}
				]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			]
		},
		clean: {
			test: [
				'tmp',
				'components'
			]
		},
		copy: {
			test: {
				files: {
					'tmp/config.js': 'test/fixtures/config.js',
					'tmp/global-config.js': 'test/fixtures/global-config.js',
					'tmp/baseurl-config.js': 'test/fixtures/baseurl-config.js',
					'tmp/multi-main-config.js': 'test/fixtures/multi-main-config.js'
				}
			}
		},
		nodeunit: {
			tasks: ['test/*_test.js']
		},
		bower: {
			options: {
				exclude: ['underscore']
			},
			standard: {
				rjsConfig: 'tmp/config.js'
			},
			global: {
				rjsConfig: 'tmp/global-config.js'
			},
			baseUrl: {
				rjsConfig: 'tmp/baseurl-config.js'
			},
			multiMain: {
				rjsConfig: 'tmp/multi-main-config.js'
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.registerTask('mkdir', function (dir) {
		require('fs').mkdirSync(dir);
	});

	grunt.registerTask('bower-install', function (target) {
		var components = ['jquery', 'underscore', 'requirejs'];
		if (target === 'multi') {
			components = ['https://github.com/cesarenaldi/component-multi-main.git'];
		}
		require('bower').commands
			.install(components)
			.on('end', this.async());
	});


	grunt.registerTask('test', [
		'clean',
		'mkdir:tmp',
		'copy',
		// 'compress:component',
		// 'connect:test',
		'bower-install:default',
		'bower:standard',
		'bower:global',
		'bower:baseUrl',
		'bower-install:multi',
		'bower:multiMain',
		'nodeunit',
		// 'clean'
	]);

	grunt.registerTask('default', ['test']);
};
