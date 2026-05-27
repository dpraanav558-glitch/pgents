@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"

REM Remove the batch file that contained the token
del /f /q _git_branch.bat

REM Stage the deletion
%GIT% add -A

REM Amend the commit to remove the file with the secret
%GIT% commit --amend --no-edit

REM Force push the clean commit
%GIT% push origin release/v1.0 --force

echo CLEAN_PUSH_DONE
