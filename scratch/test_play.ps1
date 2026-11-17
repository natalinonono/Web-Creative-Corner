$path = "D:\. ANJAYY PROJECT WEB CC\V3\public\audio\peringatan_2_menit.mp3"
if (Test-Path $path) {
    Write-Host "Found audio file!"
    $player = New-Object -ComObject WMPlayer.OCX
    $player.URL = $path
    $player.controls.play()
    Write-Host "Playing voice alarm..."
    Start-Sleep -Seconds 1
} else {
    Write-Host "File not found"
}
