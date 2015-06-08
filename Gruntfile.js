var fullRun = [
  'jshint',
  'copy',
  'concat',
  'jasmine',
  'uglify',
  'stylus',
  'encrypt'
];

module.exports = function(grunt) {

  var c = {};
  if(grunt.file.exists('config.json')){
    c = grunt.file.readJSON('config.json');
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    conf: c,
    crypt:{
      files:[                                   // files to process
        {
          dir:'./',                             // src dir of files to encrypt/ dest dir of files to decrypt
          encDir: './',                         // dest dir of files to encrypt/ src dir of files to decrypt
          include:['config.json', '!node_modules/**'],                // pattern to include files
          encryptedExtension:'.encrypted'       // extension used for encrypted files
        }
      ],
      options:{
        key: grunt.cli.options.key || '<%= conf.encryptionKey %>'  // key used to encrypt / decrypt
        // for security purpose, prefer to pass it through command line arguments
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'src/views',
        src: '**',
        dest: 'dist/views',
      },
      vendor: {
        expand: true,
        cwd: 'vendor',
        src: '**/dist/**/*.min.js',
        dest: 'src/public/js/vendor/',
      },
    },
    concat: {
      options: {
        separator: '\n\n',
		banner:";(function( window, undefined ){\n'use strict';\n\n",
		footer:"\n\nif(typeof main != 'undefined')main();\n\n}(window));",
      },
      dist: {
        src: ['src/public/js/vendor/**/*.js', 'src/public/js/*.js' ,'!src/public/js/index.js', 'src/public/js/index.js',],
        dest: 'dist/public/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> - <%= pkg.description %> By <%= pkg.author %> ( <%= pkg.homepage %> ), Built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        sourceMap:true
      },
      dist: {
        files: {
          'dist/public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'src/**/*.js', '!src/**/vendor/**', '<%= jasmine.options.specs %>', 'app.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    jasmine: {
      src: '<%= concat.dist.dest %>',
      options: {
        specs: 'spec/**/*.js',
        '--web-security': false
      }
    },
    watch: {
		most:{
			files: ['<%= jshint.files %>', 'src/views/**', 'src/public/**'],
			tasks: fullRun,
		},
		config:{
			files: ['config.json'],
			tasks: ['encrypt'],
		}, 
		vendor:{
			files: ['vendor/*/dist/**/*.min.js'],
			tasks: ['copy:vendor'],
		},
		options: { 
			livereload: 9000,
			debounceDelay: 1000,
		},
    },
    stylus: {
      compile: {
        files: {
          'dist/public/css/<%= pkg.name %>.css': 'src/public/css/index.styl'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-crypt');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', fullRun );
  grunt.registerTask('default', "Basic",function(){
	var extended = fullRun.slice();
	extended.push("watch");
	grunt.task.run(extended);
  });

};
