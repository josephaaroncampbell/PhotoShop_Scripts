@ECHO OFF

CD /d %~dp1
echo ARE THESE CORRECT?
echo source=%cd%
echo desktop=%USERPROFILE%\desktop
pause

   FOR /R %%a in (*.tif) DO (
    call :dequote %%a
  )

  :dequote
  set fileName=%~n1
  set fileExt=%~x1
  set filePath=%~dp1
  set name=%fileName%& set npath=%filePath%& set ext=%fileExt%
  echo %name%
  CD /d %~dp1
  echo source=%cd%
  set npath=%npath:\= %
  set Last_Word=
  for %%i in (%npath%) do set Last_Word=%%i
   for /f "tokens=*" %%b in ('exiftool -AlreadyApplied -S %name%%ext%') do ( 
    set rfn=%%b
    cd /d %USERPROFILE%/desktop
    echo %%b > exifTemp.txt
   )
  FIND /I "False" exifTemp.txt
  IF %ERRORLEVEL% EQU 0 ( 
   echo %name% is raw tiff
   echo removing raw edits!
   CD /d %~dp1
   echo source=%cd%
   exiftool -alreadyapplied=true -cropTop=0 -cropBottom=0 -cropLeft=0 -cropRight=0 -cropAngle=0 -overwrite_original %name%%ext%
   echo %name% was fixed
   cd /d %USERPROFILE%/desktop
   echo %name%%ext% >> isRawTiff.txt 
   del exifTemp.txt
  )