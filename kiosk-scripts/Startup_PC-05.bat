<# :
@echo off
setlocal
title Creative Corner Studio Guardian - PC-05
echo ===================================================================
echo   MEMULAI KIOSK GUARDIAN CREATIVE CORNER STUDIO - PC-05
echo ===================================================================
echo Menjalankan sistem proteksi workstation dan pelindung sesi...

:: Jalankan PowerShell Guardian di latar belakang
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Get-Content -Path '%~f0' -Raw)"
exit /b
#>

# =====================================================================
# CREATIVE CORNER STUDIO - WORKSTATION KIOSK GUARDIAN ENGINE
# Target Workstation : PC-05
# Tautan Kiosk       : https://web-creative-corner.vercel.app/?mode=kiosk&pc=PC-05
# =====================================================================
$PC_ID = "PC-05"
$ORIGIN = "https://web-creative-corner.vercel.app"
$TARGET_URL = "https://web-creative-corner.vercel.app/?mode=kiosk&pc=PC-05"
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

    # Hapus SingletonLock jika ada agar browser tidak terhalang membuka jendela
    try {
        if (Test-Path "$userData\SingletonLock") {
            Remove-Item "$userData\SingletonLock" -Force -ErrorAction SilentlyContinue
        }
    } catch {}

    if ($BROWSER_EXE) {
        if ($IS_EDGE) {
            Start-Process -FilePath $BROWSER_EXE -ArgumentList @(
                "--app=$fullUrl",
                "--kiosk",
                "--edge-kiosk-type=fullscreen",
                "--user-data-dir=$userData",
                "--no-first-run",
                "--disable-pinch"
            )
        } else {
            Start-Process -FilePath $BROWSER_EXE -ArgumentList @(
                "--app=$fullUrl",
                "--kiosk",
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
    # HANYA tutup proses browser Kiosk Creative Corner untuk PC ini.
    # JANGAN PERNAH MENUTUP Adobe Premiere Pro, Photoshop, After Effects, atau browser pribadi!
    try {
        Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
            $_.CommandLine -match "cc_kiosk_$PC_ID" 
        } | ForEach-Object {
            Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        }
    } catch {}
}

function Show-WindowsWarningPopup([string]$studentName, [string]$pcName) {
    try { [System.Media.SystemSounds]::Exclamation.Play() } catch {}
    try {
        $wsh = New-Object -ComObject WScript.Shell
        $msg = "Halo $studentName!`n`nSisa waktu pemakaian workstation $pcName tinggal 2 MENIT!`n`nSegera SIMPAN (Save / Ctrl+S) file proyek editing Anda sekarang agar hasil karya tidak hilang!"
        $wsh.Popup($msg, 8, "PERINGATAN STUDIO CREATIVE CORNER ($pcName)", 48 + 4096)
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
$status = "Tersedia"
$pengguna = $null

while ($true) {
    Start-Sleep -Seconds 2

    $data = Fetch-SessionData
    if ($data) {
        $status = $data.status
        $pengguna = $data.pengguna_aktif
    }

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
                
                # Gunakan waktuSelesaiIso jika disediakan web agar presisi
                if ($pengguna.waktuSelesaiIso) {
                    try {
                        $endTime = [DateTime]::Parse($pengguna.waktuSelesaiIso).ToLocalTime()
                    } catch {
                        $endTime = [DateTime]::Now.AddMinutes($durMin)
                    }
                } else {
                    $endTime = [DateTime]::Now.AddMinutes($durMin)
                }
                
                $warnTime = $endTime.AddMinutes(-2) # 2 Menit sebelum habis (Menit ke-3 pada timer 5 menit)
                $hasWarned = $false
                continue
            }
        }

        # Proteksi Anti Alt+F4: Jika siswa coba tutup browser paksa saat terkunci, buka lagi seketika!
        $kioskRunning = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
            $_.CommandLine -match "cc_kiosk_$PC_ID" 
        }
        if (-not $kioskRunning) {
            Start-Sleep -Milliseconds 400
            Launch-KioskBrowser
        }
    }

    # -------------------------------------------------------------
    # 2. KONDISI SESI AKTIF (SISWA SEDANG MENGEDIT DI DESKTOP)
    # -------------------------------------------------------------
    elseif ($state -eq "ACTIVE") {
        # Jika sesi diakhiri lebih awal oleh siswa atau admin di web
        if ($data -and ($status -ne "Aktif" -or (-not $pengguna))) {
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
            Close-KioskBrowserOnly
        }

        if ($pengguna.waktuSelesaiIso) {
            try {
                $endTime = [DateTime]::Parse($pengguna.waktuSelesaiIso).ToLocalTime()
                $warnTime = $endTime.AddMinutes(-2)
            } catch {}
        }

        $now = [DateTime]::Now

        # Peringatan 2 Menit Sebelum Waktu Habis (SAAT MENIT KE-3 jika durasi 5 menit)
        if ($now -ge $warnTime -and (-not $hasWarned)) {
            $hasWarned = $true
            $namaSiswa = if ($pengguna.nama) { $pengguna.nama } else { "Siswa" }
            Write-Host "Peringatan 2 Menit tercapai: Membuka Web Peringatan Kiosk untuk $namaSiswa..."
            
            # 1. Mainkan suara notifikasi
            try { [System.Media.SystemSounds]::Exclamation.Play() } catch {}
            
            # 2. Munculkan pop-up modal Windows
            Show-WindowsWarningPopup -studentName $namaSiswa -pcName $PC_ID
            
            # 3. BUKA KEMBALI WEB KIOSK DI LAYAR DENGAN NOTIFIKASI PERINGATAN & HITUNG MUNDUR
            Launch-KioskBrowser "warning=true"
        }

        # Waktu Habis (0 Menit / MENIT KE-5 jika durasi 5 menit)
        if ($now -ge $endTime) {
            Write-Host "Waktu habis (00:00)! Menampilkan Kiosk Pengunci Layar..."
            $state = "EXPIRED"
            Close-KioskBrowserOnly
            Start-Sleep -Milliseconds 400
            # Buka kembali Kiosk untuk mengunci layar (Software editing TETAP AMAN di latar belakang)
            Launch-KioskBrowser "expired=true"
        }
    }

    # -------------------------------------------------------------
    # 3. KONDISI WAKTU HABIS (LAYAR TERKUNCI MENUNGGU KONFIRMASI)
    # -------------------------------------------------------------
    elseif ($state -eq "EXPIRED") {
        # Opsi A: Siswa telah klik "Konfirmasi Selesai & Kunci PC"
        if ($data -and ($status -ne "Aktif" -or (-not $pengguna))) {
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

        # Proteksi Anti Alt+F4 saat waktu habis: Buka kembali jika browser Kiosk tertutup sebelum konfirmasi selesai
        $kioskRunning = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
            $_.CommandLine -match "cc_kiosk_$PC_ID" 
        }
        if (-not $kioskRunning) {
            Start-Sleep -Milliseconds 400
            Launch-KioskBrowser "expired=true"
        }
    }
}
