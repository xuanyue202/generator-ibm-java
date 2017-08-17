/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Test to see if when you choose every technology type it builds */

'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

const ARTIFACTID = 'artifact.0.1';
const GROUPID = 'test.group';
const VERSION = '1.0.0';
const APPNAME = 'testApp';
const FRAMEWORK = 'liberty';

const tests = require('@arf/java-common');
const command = tests.test('command');

function Options(createType, buildType, testBluemix, technologies) {
  this.options = {
    headless :  "true",
    debug : "true",
    buildType : buildType,
    createType : createType,
    promptType : 'prompt:liberty',
    technologies : technologies,
    appName : APPNAME,
    groupId : GROUPID,
    artifactId : ARTIFACTID,
    version : VERSION,
    bluemix : {
      backendPlatform : 'JAVA'
    }
  }
  this.assertBuilds = function() {
    command.run(tests.test(buildType).getBuildCommand());
  }
  this.before = function() {
    return helpers.run(path.join( __dirname, '../../generators/app'))
      .withOptions(this.options)
      .withPrompts({})
      .toPromise();
  }
}

describe('java generator : technologies end to end test', function() {
  this.timeout(7000);
  var buildTypes = ['gradle', 'maven'];
  for(var i=0; i < buildTypes.length; i++) {
    describe('Generates a project with springbootweb technology type and build type ' + buildTypes[i], function () {
      var technologies = ['springbootweb'];
      var options = new Options('picnmix', buildTypes[i], false, technologies);
      before(options.before.bind(options));
      options.assertBuilds();
    });
    describe('Generates a project with all technologies except springbootweb and build type ' + buildTypes[i], function () {
      var technologies = ['rest', 'microprofile', 'persistence', 'websocket', 'web', 'watsonsdk', 'swagger'];
      var options = new Options('picnmix', buildTypes[i], false, technologies);
      before(options.before.bind(options));
      options.assertBuilds();
    });
  }
});
