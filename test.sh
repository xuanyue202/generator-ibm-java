#!/bin/bash
echo Clearing projects directory
rm -rf ./projects
echo Testing : docker run -it -v `pwd`/projects:/projects  yeoman_yo-java
docker run -it -v `pwd`/projects:/projects  yeoman_yo-java
