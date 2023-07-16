
    $ProcessHackerPath = "C:\Program Files\Process Hacker\ProcessHacker.exe"
    $ApplicationName = "chrome"
    $TempFilePath = "C:\jweboss folder\USER PC\projects\greeniewebText\backend\power_consumption.txt"

    $ProcessId = (Get-WmiObject -Class Win32_Process | Where-Object { $_.Name -like "*$ApplicationName*" }).ProcessId
    if ($ProcessId) {
      $ProcessPower = & $ProcessHackerPath -pid $ProcessId -cputimes -noheader -notitle -csv
      $ProcessPower | Out-File -FilePath $TempFilePath -Encoding utf8
    }
  