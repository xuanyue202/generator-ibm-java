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

//test the config module

var assert = require('assert');
var Config = require('../../generators/lib/config');
var path = require('path');

const CONFIG_FILE = "config.js";

describe('Config behaviour', function() {
  it('should be possible to reset config values', function(){
    var config = new Config();
    config.artifactId = 'testID';
    config.bluemix = {name : 'bxName'};
    config.reset();
    assert.equal('artifactId', config.artifactId);
    assert.equal(undefined, config.bluemix);
  });
});

describe('Config defaults', function() {
  it('artifactId should be set to "artifactId" when the value has not been set', function(){
    var config = new Config();
    assert.equal('artifactId', config.artifactId);
  });
  it('groupId should be set to "groupId" when the value has not been set', function(){
    var config = new Config();
    assert.equal('groupId', config.groupId);
  });
  it('name should be set to "myLibertyProject" when the value has not been set', function(){
    var config = new Config();
    assert.equal('myLibertyProject', config.appName);
  });
  it('build should be set to "maven" when the build type has not been set', function(){
    var config = new Config();
    assert.equal('maven', config.buildType);
  });
});


describe('Config validation', function() {
  it('should not be valid when the name contains invalid characters', function(){
    var config = new Config();
    assert.equal(true, config.isValid());
  });
  it('should not be valid when the name is either missing or an empty string', function(){
    var config = new Config();
    config.appName = undefined;
    assert.equal(false, config.isValid());
    config.appName = '';
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the name contains invalid characters', function(){
    var config = new Config();
    config.appName = "wibble%";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the name contains too many characters', function(){
    var config = new Config();
    config.appName = "ThisIsAReallyLongNameButIsItLongEnoughNotQuiteSoLetsKeepGoing";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the artifactId contains invalid characters', function(){
    var config = new Config();
    config.artifactId = "%wibble";
    assert.equal(false, config.isValid());
  });
  it('should not be valid when the groupId contains invalid characters', function(){
    var config = new Config();
    config.groupId = "%wibble";
    assert.equal(false, config.isValid());
  });
});

describe('Config file processing', function() {
  it('it should find the control file in the root', function() {
    var config = new Config();
    var templatePath = [path.resolve("./test/resources/config/with-config")];
    config.processProject(templatePath);
    assert(config.configFiles);
    assert.equal(config.configFiles.length, 1);
    assert.equal(config.configFiles[0], path.resolve(templatePath[0], CONFIG_FILE));
  });
  it('it should support not having a config file in a directory', function() {
    var config = new Config();
    var templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/without-config")];
    config.processProject(templatePath);
    assert(config.configFiles);
    assert.equal(config.configFiles.length, 1);
    assert.equal(config.configFiles[0], path.resolve(templatePath[0], CONFIG_FILE));
  });
  it('it should add the config into the config.properties object', function() {
    var config = new Config();
    var templatePath = [path.resolve("./test/resources/config/with-config"), path.resolve("./test/resources/config/without-config")];
    config.processProject(templatePath);
    assert.equal(config.properties[0].name, 'testName');
    assert.equal(config.properties[0].value, 'testValue');
  });
  it('it should set alternative Gradle names and values when the build type is Gradle', function() {
    var config = new Config();
    var templatePath = [path.resolve("./test/resources/config/with-gradle-config")];
    config.buildType = 'gradle';
    config.processProject(templatePath);
    var properties = [config.properties[0].name + "=" + config.properties[0].value];
    for(var i = 1; i < config.properties.length; i++) {
      properties.push(config.properties[i].name + "=" + config.properties[i].value);
    }
    assert.equal(properties.length, 2)
    assert(properties.includes('testGradleName1=testValue1'), 'properties=' + properties);
    assert(properties.includes('testName2=testGradleValue2'), 'properties=' + properties);
  });
  it('it should add the dependencies into the config.deps object', function() {
    var config = new Config();
    var templatePath = [path.resolve("./test/resources/config/with-config")];
    config.processProject(templatePath);
    assert.equal(config.deps[0].groupId, 'test.group.id');
    assert.equal(config.deps[0].artifactId, 'testArtifactId');
    assert.equal(config.deps[0].version, '0.0.1');
    assert.equal(config.deps[0].scope, 'provided');
  });
});
