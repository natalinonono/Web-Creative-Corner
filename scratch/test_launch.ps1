$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$url = 'https://web-creative-corner.vercel.app/?mode=kiosk&pc=PC-05'
$p = Start-Process -FilePath $chrome -ArgumentList @("--app=$url", "--kiosk") -PassThru
Start-Sleep -Seconds 2
Write-Host "Process ID: $($p.Id), HasExited: $($p.HasExited)"
