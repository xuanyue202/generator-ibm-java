{
  "excludes" : [
    ".classpath",
    ".project",
    {{#has buildType 'maven'}}
    "build.gradle",
    {{/has}}

    {{#has buildType 'gradle'}}
    "pom.xml",
    {{/has}}
  ],
  "excludesDir" : [
    "target",
    ".settings",
    "build"
  ],
  "composition" : [
    "basic",
    "bluemix",
    "frameworks/liberty",
    {{#each technologies}}
    "technologies/{{this.name}}",
    {{/each}}
  ]
}
