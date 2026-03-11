# Quick fix script for JAVA_HOME in IntelliJ IDEA terminal
# Run this in IntelliJ's terminal before running Maven commands

$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
Write-Host "Java version:" -ForegroundColor Green
java -version

