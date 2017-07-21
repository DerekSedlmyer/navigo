module.exports = {
    options: {
        includePaths: [
            'bower_components'
        ]
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/styles',
            src: ['*.scss'],
            dest: '<%= yeoman.app %>/assets/css',
            ext: '.css'
        }]
    },
    server: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/styles',
            src: ['*.scss'],
            dest: '<%= yeoman.app %>/assets/css',
            ext: '.css'
        }]
    }
};