@echo off
title Install Dependencies

echo Prematurely installing needle globally..
call npm install needle -g
echo Installing dependencies..
call npm install pkg.json
echo Finished!