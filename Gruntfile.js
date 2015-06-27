module.exports = function (grunt) {
    var sourceFiles = ['**', "!node_modules/**", "!Gruntfile.js", "!package.json"];
    var releaseDir = "../eote-hangouts-dice-roller-release/";
    var qaDir = "../eote-hangouts-dice-roller-qa/";
    var localDir = "../eote-hangouts-dice-roller-local/";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            release: {},
            qa: {},
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
                    to: "https://cjhooker.github.io/eote-dice-roller-release/"
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: "https://cjhooker.github.io/eote-dice-roller-release/"
                }, {
                    from: "[[APP_ID]]",
                    to: "1028986225138"
                }, {
                    from: "[[DEBUG_WATERMARK]]",
                    to: ""
                }]
            },
            qa: {
                src: [qaDir + "/**/*.html", qaDir + "/**/*.xml", qaDir + "/**/*.css", qaDir + "/**/*.js"],
                overwrite: true,
                replacements: [{
                    from: "[[APP_HTML]]",
                    to: grunt.file.read("app.html")
                }, {
                    from: "[[HANGOUT_JS]]",
                    to: "//plus.google.com/hangouts/_/api/v1/hangout.js"
                }, {
                    from: "[[BASE_PATH]]",
                    to: "https://cjhooker.github.io/eote-dice-roller-qa/"
                    //to: "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: "https://cjhooker.github.io/eote-dice-roller-qa/"
                    //to: "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
                }, {
                    from: "[[APP_ID]]",
                    to: "484530845672"
                }, {
                    from: "[[DEBUG_WATERMARK]]",
                    to: "<div class='debugWatermark'>QA</div>"
                }]
            },
            local: {
                src: [localDir + "/**/*.html", localDir + "/**/*.xml", localDir + "/**/*.css", localDir + "/**/*.js"],
                overwrite: true,
                replacements: [{
                    from: "[[HANGOUT_JS]]",
                    to: "[[BASE_PATH]]js/fakes/hangout-fake.js"
                }, {
                    from: "[[BASE_PATH]]",
                    to: ""
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: "../"
                }, {
                    from: "[[DEBUG_WATERMARK]]",
                    to: "<div class='debugWatermark'>LOCAL</div>"
                }]
            }
        },
        copy: {
            release: {
                expand: true,
                src: sourceFiles,
                dest: releaseDir,
            },
            qa: {
                expand: true,
                src: sourceFiles,
                dest: qaDir,
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
                // This will leave the .git folder intact
                src: [releaseDir + "/*.*", releaseDir + "/*/**"]
            },
            qa: {
                options: {
                    force: true
                },
                // This will leave the .git folder intact
                src: [qaDir + "/*.*", qaDir + "/*/**"]
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