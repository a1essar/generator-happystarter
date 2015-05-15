'use strict';
var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    inquirer = require('inquirer'),
    shelljs = require('shelljs'),
    _ = require('lodash'),
    s = require('underscore.string'),
    config = require('./config.json');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        this.appRoot = config.paths.appRoot;

        yeoman.generators.Base.apply(this, arguments);
    },

    prompting: function () {
        var done = this.async(),
            promptsConfigsChoices = _.chain(config.configs).
                map(function(el) {
                    return el.type;
                })
                .uniq()
                .map(function(type) {
                    var choices = [];

                    choices[0] = new inquirer.Separator(type + ':');

                    _.forEach(config.configs, function(el, name) {
                        if (type === el.type) {
                            choices.push({
                                name: name,
                                checked: el.uses
                            });
                        }
                    });

                    return choices;
                })
                .flatten()
                .value(),
            prompts = [
                {
                    type: 'input',
                    name: 'appName',
                    message: 'What\'s your app name',
                    'default': path.basename(this.destinationRoot())
                },
                {
                    type: 'confirm',
                    name: 'gitInit',
                    message: 'Initialize git repository?'
                },
                {
                    type: 'list',
                    name: 'ide',
                    message: 'Select development environment:',
                    choices: [
                        'IntelliJ IDEA (phpstorm, webstorm)'
                    ],
                    'default': 0,
                    filter: function (value) {
                        return s(value.substr(0, value.indexOf('(') - 1)).trim().decapitalize().camelize().value();
                    }
                },
                {
                    name: 'configs',
                    type: 'checkbox',
                    message: 'Select configs:',
                    choices: function (answers) {
                        if (!answers.gitInit) {
                            _.map(promptsConfigsChoices, function (el) {
                                if (el.name === '.gitignore' || el.name === '.gitattributes') {
                                    el.checked = false;
                                }

                                return el;
                            });
                        }

                        return promptsConfigsChoices;
                    }
                }
            ];

        // Have Yeoman greet the user.
        this.log(yosay(
            'You better ' + chalk.red('work') + ' bitch!'
        ));

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;
            this.appName = this.props.appName;

            done();
        }.bind(this));
    },

    writing: {
        dirs: function () {
            _.forEach(config.paths, function(dir) {
                mkdirp.sync(this.destinationRoot() + path.sep + dir);
            }, this);
        },
        configs: function () {
            _.forEach(this.props.configs, function(el) {
                this.copy('configs/' + el, el);
            }, this);
        },
        packages: function () {
            this.template('packages/_package.json', 'package.json');
            this.template('packages/_bower.json', 'bower.json');
        },
        gulp: function () {
            this.copy('gulpfile.js', 'gulpfile.js');
        },
        ide: function () {
            if (this.props.ide === 'intelliJIDEA') {
                mkdirp.sync(this.destinationRoot() + path.sep + '.idea');
                this.template('ide/.idea/.name', '.idea/.name');
                this.template('ide/.idea/webResources.xml', '.idea/webResources.xml');
                this.copy('ide/.idea/ideaProject.iml', '.idea/' + this.appName + '.iml');
                this.copy('ide/.idea/encodings.xml', '.idea/encodings.xml');
                this.copy('ide/.idea/modules.xml', '.idea/modules.xml');

                if (this.props.gitInit) {
                    this.copy('ide/.idea/vcs.xml', '.idea/vcs.xml');
                }
            }
        },
        app: function () {

        },
        projectfiles: function () {
            this.copy('index.html', config.paths.appRoot + '/' + 'index.html');
            this.copy('humans.txt', config.paths.appRoot + '/' + 'humans.txt');
            this.copy('robots.txt', config.paths.appRoot + '/' + 'robots.txt');
            this.copy('crossdomain.xml', config.paths.appRoot + '/' + 'crossdomain.xml');
            this.copy('browserconfig.xml', config.paths.appRoot + '/' + 'browserconfig.xml');
        }
    },

    install: function () {
        if (this.props.gitInit) {
            shelljs.exec('git init');
            shelljs.exec('git add .');
            shelljs.exec('git commit -m "first commit"');
        }

        //this.installDependencies();
    }
});
