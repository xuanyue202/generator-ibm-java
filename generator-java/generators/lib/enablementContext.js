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

 //context that provides adaption for calling into enablement generators
 'use strict'

module.exports = class {
  constructor(contexts) {
    this.contexts = contexts;
  }

  //called by service enablement generator to add dependencies
  _addDependencies (json) {
    var data = JSON.parse(json);
    this.contexts.forEach(context => {
      if(data.dependencies) {
        context.conf.addDependencies(data.dependencies);
      }
      if(data.properties) {
        context.conf.addProperties(data.properties);
      }
      if(data.jndiEntries) {
        context.conf.addJndiEntries(data.jndiEntries);
      }
      if(data.envEntries) {
        context.conf.addEnvEntries(data.envEntries);
      }
      if(data.frameworkDependencies) {
        context.conf.addFrameworkDependencies(data.frameworkDependencies);
      }
    });
  }
}
