Set shell = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")
root = fs.GetParentFolderName(WScript.ScriptFullName)
server = """" & root & "\tools\start_server.py"""

'Kill existing ReasonForge servers
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ""Get-CimInstance Win32_Process | Where-Object { (($_.Name -eq 'python.exe' -or $_.Name -eq 'pythonw.exe') -and $_.CommandLine -like '*start_server.py*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }""", 0, True

'Launch server silently via pythonw (no console window)
On Error Resume Next
shell.Run "pythonw.exe " & server, 0, False
If Err.Number <> 0 Then
    Err.Clear
    shell.Run "python.exe " & server, 0, False
End If
If Err.Number <> 0 Then
    MsgBox "Python 3 was not found. Install Python and enable 'Add Python to PATH'.", vbExclamation, "ReasonForge"
End If
On Error Goto 0
