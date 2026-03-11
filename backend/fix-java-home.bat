@echo off
REM Quick fix script for JAVA_HOME in IntelliJ IDEA terminal
REM Run this in IntelliJ's terminal before running Maven commands

set JAVA_HOME=C:\Program Files\Java\jdk-23
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME set to: %JAVA_HOME%
echo Java version:
java -version

