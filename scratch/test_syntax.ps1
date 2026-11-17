$code = Get-Content -Path "kiosk-scripts\Startup_PC-05.bat" -Raw
$tokens = $null
$errors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseInput($code, [ref]$tokens, [ref]$errors)
if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Host "Error: $($_.Message) at line $($_.Extent.StartLineNumber)" }
} else {
    Write-Host "Startup_PC-05.bat syntax is completely valid!"
}
