@ECHO OFF

   FOR /R %%a in (*.tif) DO (
    call :dequote %%a
  )

  :dequote
  set fileName=%~n1
  set fileExt=%~x1
  set filePath=%~dp1
  set name=%fileName%& set npath=%filePath%& set ext=%fileExt%
  CD %npath% 
  echo %name%
  set npath=%npath:\= %
  set Last_Word=
  for %%i in (%npath%) do set Last_Word=%%i
  for /f %%b in ('identify -quiet -format "%%[tiff:has-layers]" %name%%ext%[0]') do (
	ECHO 2: %%b
	IF %%b == true ECHO %name%>>%Last_Word%.txt & echo %name%>>%~dp0/all_files_found.txt
    
        
  )
  