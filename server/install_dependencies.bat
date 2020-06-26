@echo off
title Install Dependencies

echo Prematurely installing needle globally..
CALL npm install needle -g
echo Installing dependencies..
CALL npm install pkg.json
echo Finished!
pause