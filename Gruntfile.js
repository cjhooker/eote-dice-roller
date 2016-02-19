module.exports = function (grunt) {
    var sourceFiles = ['**', "!node_modules/**", "!Gruntfile.js", "!package.json", "!compilerconfig.*"];
    var releaseDir = "../eote-dice-roller-release/";
    var qaDir = "../eote-dice-roller-qa/";
    var devDir = "../eote-dice-roller-dev/";
    var localDir = "../eote-dice-roller-local/";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            release: {},
            qa: {},
            dev: {},
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
                    to: grunt.option("release-url") || "https://cjhooker.github.io/eote-dice-roller-release/"
                    //to: "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: grunt.option("release-url") || "https://cjhooker.github.io/eote-dice-roller-release/"
                    //to: "https://eote-hangouts-dice-roller-release.googlecode.com/git/"
                }, {
                    from: "[[APP_ID]]",
                    to: grunt.option("release-app-id") || "1028986225138"
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
                    to: grunt.option("qa-url") || "https://cjhooker.github.io/eote-dice-roller-qa/"
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: grunt.option("qa-url") || "https://cjhooker.github.io/eote-dice-roller-qa/"
                }, {
                    from: "[[APP_ID]]",
                    to: grunt.option("qa-app-id") || "484530845672"
                }, {
                    from: "[[DEBUG_WATERMARK]]",
                    to: "<div class='debugWatermark'>BETA</div>"
                }]
            },
            dev: {
                src: [devDir + "/**/*.html", devDir + "/**/*.xml", devDir + "/**/*.css", devDir + "/**/*.js"],
                overwrite: true,
                replacements: [{
                    from: "[[APP_HTML]]",
                    to: grunt.file.read("app.html")
                }, {
                    from: "[[HANGOUT_JS]]",
                    to: "//plus.google.com/hangouts/_/api/v1/hangout.js"
                }, {
                    from: "[[BASE_PATH]]",
                    to: grunt.option("dev-url") || "https://cjhooker.github.io/eote-dice-roller-dev/"
                }, {
                    from: "[[BASE_PATH_CSS]]",
                    to: grunt.option("dev-url") || "https://cjhooker.github.io/eote-dice-roller-dev/"
                }, {
                    from: "[[APP_ID]]",
                    to: grunt.option("dev-app-id") || "507949691428"
                }, {
                    from: "[[DEBUG_WATERMARK]]",
                    to: "<div class='debugWatermark'>DEV</div>"
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
            dev: {
                expand: true,
                src: sourceFiles,
                dest: devDir,
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
            dev: {
                options: {
                    force: true
                },
                // This will leave the .git folder intact
                src: [devDir + "/*.*", devDir + "/*/**"]
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