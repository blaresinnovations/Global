$procs = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($procs) {
  foreach ($p in $procs) {
    Write-Host "Stopping PID $p"
    try { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } catch {}
  }
} else {
  Write-Host "No process found on port 4000"
}

Set-Location -Path $PSScriptRoot
npm run dev
