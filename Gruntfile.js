module.exports = function (grunt) {
    var sourceFiles = ['**', "!node_modules/**", "!Gruntfile.js", "!package.json"];
    var releaseDir = "../grunt-release/";
    var localDir = "../grunt-local/";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            release: {},
            local: {}
        },
        replace: {
            release: {
                src: [releaseDir + "/**/*.html", releaseDir + "/**/*.xml", releaseDir + "/**/*.css", releaseDir + "/**/*.js"],
                overwrite: true,
                replacements: [{
                    from: "[[APP_HTML]]", 
                    to: grunt.file.read("app.html")
                }, {
                    from: "[[HANGOUT_JS]]",
                    to: "//plus.google.com/hangouts/_/api/v1/hangout.js"
                }, {
                    from: "[[BASE_PATH]]",
                    to: "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
                }]
            },
            local: {
                src: [localDir + "/**/*.html", localDir + "/**/*.xml", localDir + "/**/*.css", localDir + "/**/*.js"],
                overwrite: true,
                replacements: [{
                    from: "[[APP_HTML]]", 
                    to: grunt.file.read("app.html")
                }, {
                    from: "[[HANGOUT_JS]]",
                    to: "[[BASE_PATH]]js/fakes/hangout-fake.js"
                }, {
                    from: "[[BASE_PATH]]",
                    to: ""
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: "../"
                }]
            }
        },
        copy: {
            release: {
                expand: true,
                src: sourceFiles,
                dest: releaseDir,
            },
            local: {
                expand: true,
                src: sourceFiles.concat("!app.xml"),
                dest: localDir,
            },
        },
        clean: {
            release: {
                options: {
                    force: true
                },
                src: [releaseDir]
            },
            local: {
                options: {
                    force: true
                },
                src: [localDir]
            },
        }
    });

    grunt.registerMultiTask('build', 'Build the app.', function () {
        grunt.task.run('clean:' + this.target);
        grunt.task.run('copy:' + this.target);
        grunt.task.run('replace:' + this.target);
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
};