<# :
@echo off
setlocal
title Creative Corner Studio Guardian - PC-03
echo ===================================================================
echo   MEMULAI KIOSK GUARDIAN CREATIVE CORNER STUDIO - PC-03
echo ===================================================================
echo Menjalankan sistem proteksi workstation dan pelindung sesi...

:: Jalankan PowerShell Guardian di latar belakang
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Get-Content -Path '%~f0' -Raw)"
exit /b
#>

# =====================================================================
# CREATIVE CORNER STUDIO - WORKSTATION KIOSK GUARDIAN ENGINE
# Target Workstation : PC-03
# Tautan Kiosk       : https://web-creative-corner.vercel.app/?mode=kiosk&pc=PC-03
# =====================================================================
$PC_ID = "PC-03"
$ORIGIN = "https://web-creative-corner.vercel.app"
$TARGET_URL = "https://web-creative-corner.vercel.app/?mode=kiosk&pc=PC-03"
$SUPABASE_URL = "https://yrtbrsqrmgzzojecjyra.supabase.co"
$SUPABASE_KEY = "sb_publishable_9g6jPzgtyXGMQ6uLqDR5Mg_iMnA-BWb"
$HEADERS = @{
    "apikey" = $SUPABASE_KEY
    "Authorization" = "Bearer $SUPABASE_KEY"
}

# 1. Deteksi Browser Google Chrome atau Microsoft Edge
$BROWSER_EXE = ""
$IS_EDGE = $false

if (Test-Path "$env:ProgramFiles\Google\Chrome\Application\chrome.exe") {
    $BROWSER_EXE = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
} elseif (Test-Path "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe") {
    $BROWSER_EXE = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
} elseif (Test-Path "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") {
    $BROWSER_EXE = "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
} elseif (Test-Path "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") {
    $BROWSER_EXE = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
    $IS_EDGE = $true
} elseif (Test-Path "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") {
    $BROWSER_EXE = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
    $IS_EDGE = $true
}

function Launch-KioskBrowser([string]$urlParam = "") {
    $fullUrl = $TARGET_URL
    if ($urlParam) {
        $fullUrl = "$TARGET_URL&$urlParam"
    }
    $userData = "$env:TEMP\cc_kiosk_$PC_ID"

    if ($BROWSER_EXE) {
        if ($IS_EDGE) {
            Start-Process -FilePath $BROWSER_EXE -ArgumentList @(
                "--kiosk",
                $fullUrl,
                "--edge-kiosk-type=fullscreen",
                "--user-data-dir=$userData",
                "--no-first-run",
                "--disable-pinch"
            )
        } else {
            Start-Process -FilePath $BROWSER_EXE -ArgumentList @(
                "--kiosk",
                $fullUrl,
                "--user-data-dir=$userData",
                "--no-first-run",
                "--disable-pinch",
                "--overscroll-history-navigation=0"
            )
        }
    } else {
        Start-Process $fullUrl
    }
}

function Close-KioskBrowserOnly() {
    # HANYA tutup jendela browser Chrome/Edge Kiosk.
    # PENTING: JANGAN SEKALI-KALI MENUTUP Adobe Premiere Pro, Photoshop, After Effects, atau aplikasi editing lainnya!
    try {
        Get-Process -Name chrome, msedge -ErrorAction SilentlyContinue | ForEach-Object {
            try { $_.CloseMainWindow() | Out-Null } catch {}
        }
        Start-Sleep -Milliseconds 600
        # Bersihkan sisa proses browser Kiosk
        Get-Process -Name chrome, msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    } catch {}
}

function Show-WindowsWarningPopup([string]$studentName, [string]$pcName) {
    # Mainkan suara notifikasi sistem Windows
    try { [System.Media.SystemSounds]::Exclamation.Play() } catch {}

    # Munculkan pop-up Top-Most di atas aplikasi yang sedang aktif tanpa menutup aplikasi
    try {
        $wsh = New-Object -ComObject WScript.Shell
        $msg = "Halo $studentName!`n`nSisa waktu pemakaian workstation $pcName tinggal 2 MENIT!`n`nSegera SIMPAN (Save / Ctrl+S) file proyek editing Anda sekarang agar hasil karya tidak hilang!"
        # 48 = Icon Peringatan Kuning, 4096 = System Modal (Selalu di atas layar)
        $wsh.Popup($msg, 12, "PERINGATAN STUDIO CREATIVE CORNER ($pcName)", 48 + 4096)
    } catch {}
}

function Fetch-SessionData() {
    try {
        $res = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/pc_clients?id=eq.$PC_ID" -Headers $HEADERS -Method Get -TimeoutSec 3
        if ($res -and $res.Count -gt 0) {
            return $res[0]
        }
    } catch {}
    return $null
}

# --- SIKLUS UTAMA PENGAWASAN WORKSTATION STUDIO ---
Write-Host "Kiosk Guardian Aktif untuk $PC_ID..."

# Mulai dengan meluncurkan layar Kiosk awal
Launch-KioskBrowser

$state = "LOCKED" # Status: LOCKED, ACTIVE, EXPIRED
$endTime = [DateTime]::MinValue
$warnTime = [DateTime]::MinValue
$hasWarned = $false
$lastDuration = 0

while ($true) {
    Start-Sleep -Seconds 2

    $data = Fetch-SessionData
    $status = if ($data) { $data.status } else { "Tersedia" }
    $pengguna = if ($data) { $data.pengguna_aktif } else { $null }

    # -------------------------------------------------------------
    # 1. KONDISI TERKUNCI (STANDBY FORM MASUK)
    # -------------------------------------------------------------
    if ($state -eq "LOCKED") {
        # Jika siswa telah mengisi form & klik "Mulai Sesi"
        if ($status -eq "Aktif" -and $pengguna) {
            $durMin = [int]$pengguna.durasiMenit
            if ($durMin -gt 0) {
                Write-Host "Sesi dimulai oleh $($pengguna.nama) ($durMin Menit). Menutup Kiosk..."
                Close-KioskBrowserOnly
                $state = "ACTIVE"
                $lastDuration = $durMin
                $endTime = [DateTime]::Now.AddMinutes($durMin)
                $warnTime = $endTime.AddMinutes(-2) # 2 Menit sebelum habis
                $hasWarned = $false
                continue
            }
        }

        # Proteksi Anti Alt+F4: Jika siswa coba tutup browser paksa saat terkunci, buka lagi seketika!
        $browserRunning = Get-Process -Name chrome, msedge -ErrorAction SilentlyContinue
        if (-not $browserRunning) {
            Start-Sleep -Milliseconds 400
            Launch-KioskBrowser
        }
    }

    # -------------------------------------------------------------
    # 2. KONDISI SESI AKTIF (SISWA SEDANG MENGEDIT DI DESKTOP)
    # -------------------------------------------------------------
    elseif ($state -eq "ACTIVE") {
        # Jika sesi diakhiri lebih awal oleh siswa atau admin
        if ($status -ne "Aktif" -or (-not $pengguna)) {
            Write-Host "Sesi diakhiri lebih awal. Mengunci kembali workstation..."
            $state = "LOCKED"
            Launch-KioskBrowser
            continue
        }

        # Jika durasi diperpanjang (+15 menit, dll.)
        $currentDur = [int]$pengguna.durasiMenit
        if ($currentDur -gt $lastDuration) {
            $diff = $currentDur - $lastDuration
            Write-Host "Waktu pemakaian diperpanjang +$diff Menit!"
            $lastDuration = $currentDur
            $endTime = $endTime.AddMinutes($diff)
            $warnTime = $endTime.AddMinutes(-2)
            $hasWarned = $false
        }

        $now = [DateTime]::Now

        # Peringatan 2 Menit Sebelum Waktu Habis
        if ($now -ge $warnTime -and (-not $hasWarned)) {
            $hasWarned = $true
            $namaSiswa = if ($pengguna.nama) { $pengguna.nama } else { "Siswa" }
            Write-Host "Peringatan 2 Menit dikirim ke layar untuk $namaSiswa..."
            Show-WindowsWarningPopup -studentName $namaSiswa -pcName $PC_ID
        }

        # Waktu Habis (0 Menit)
        if ($now -ge $endTime) {
            Write-Host "Waktu habis! Menampilkan Kiosk Pengunci Layar..."
            $state = "EXPIRED"
            # Buka kembali Kiosk untuk mengunci layar (Aplikasi editing Premiere/Photoshop TETAP JALAN di latar belakang)
            Launch-KioskBrowser "expired=true"
        }
    }

    # -------------------------------------------------------------
    # 3. KONDISI WAKTU HABIS (LAYAR TERKUNCI MENUNGGU KONFIRMASI)
    # -------------------------------------------------------------
    elseif ($state -eq "EXPIRED") {
        # Opsi A: Siswa telah klik "Konfirmasi Selesai & Kunci PC"
        if ($status -ne "Aktif" -or (-not $pengguna)) {
            Write-Host "Pengguna mengonfirmasi selesai. Mereset ke standby siap pakai..."
            $state = "LOCKED"
            Close-KioskBrowserOnly
            Start-Sleep -Milliseconds 500
            Launch-KioskBrowser
            continue
        }

        # Opsi B: Siswa memilih "Perpanjang Waktu" (+15 Menit, dll.)
        $currentDur = [int]$pengguna.durasiMenit
        if ($currentDur -gt $lastDuration) {
            $diff = $currentDur - $lastDuration
            Write-Host "Pengguna memperpanjang waktu +$diff Menit. Menutup Kiosk agar dapat lanjut ngedit..."
            $lastDuration = $currentDur
            Close-KioskBrowserOnly
            $state = "ACTIVE"
            $endTime = [DateTime]::Now.AddMinutes($diff)
            $warnTime = $endTime.AddMinutes(-2)
            $hasWarned = $false
            continue
        }

        # Proteksi Anti Alt+F4 saat waktu habis: Tidak bisa ditutup tanpa konfirmasi selesai / perpanjang!
        $browserRunning = Get-Process -Name chrome, msedge -ErrorAction SilentlyContinue
        if (-not $browserRunning) {
            Start-Sleep -Milliseconds 400
            Launch-KioskBrowser "expired=true"
        }
    }
}

