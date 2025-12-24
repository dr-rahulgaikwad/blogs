@echo off
if "%1"=="" (
    echo Usage: add filename.md
    exit /b
)
node blog.js %1