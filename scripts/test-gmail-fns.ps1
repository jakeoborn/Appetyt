$base = 'https://nsmwgokjjnpwwvearwxf.supabase.co/functions/v1'
$key  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbXdnb2tqam5wd3d2ZWFyd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTY4MjIsImV4cCI6MjA5MjkzMjgyMn0.CRuLwGQNFwhbEQ5JEx-a-bN3orjEh6OIwMgLUgDFgxY'
$dev  = 'smoke-gmail-' + [Guid]::NewGuid().ToString().Substring(0,8)

function GetNoFollow($url) {
  $req = [System.Net.HttpWebRequest]::Create($url)
  $req.Method = 'GET'
  $req.AllowAutoRedirect = $false
  $req.Timeout = 30000
  try {
    $resp = $req.GetResponse()
    $status = [int]$resp.StatusCode
    $loc = $resp.Headers['Location']
    $resp.Close()
    return @{ status = $status; location = $loc; body = '' }
  } catch [System.Net.WebException] {
    $resp = $_.Exception.Response
    if ($resp -ne $null) {
      $status = [int]$resp.StatusCode
      $loc = $resp.Headers['Location']
      $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
      $body = $reader.ReadToEnd()
      $reader.Close()
      return @{ status = $status; location = $loc; body = $body }
    }
    return @{ status = 0; location = $null; body = $_.Exception.Message }
  }
}

function PostJson($url, $bodyObj) {
  $body = $bodyObj | ConvertTo-Json -Compress
  $headers = @{ apikey = $key; Authorization = "Bearer $key"; 'Content-Type' = 'application/json' }
  try {
    $r = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
    return @{ status = $r.StatusCode; body = $r.Content }
  } catch [System.Net.WebException] {
    $resp = $_.Exception.Response
    if ($resp -ne $null) {
      $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
      return @{ status = [int]$resp.StatusCode; body = $reader.ReadToEnd() }
    }
    return @{ status = 0; body = $_.Exception.Message }
  }
}

Write-Host '=== gmail-oauth-start (expect 302 -> accounts.google.com) ===' -ForegroundColor Cyan
$r = GetNoFollow "$base/gmail-oauth-start?device_id=$dev"
Write-Host "STATUS: $($r.status)"
Write-Host "LOCATION: $($r.location)"
Write-Host ''

Write-Host '=== gmail-oauth-callback (no code, expect 302 -> error hash) ===' -ForegroundColor Cyan
$r = GetNoFollow "$base/gmail-oauth-callback"
Write-Host "STATUS: $($r.status)"
Write-Host "LOCATION: $($r.location)"
Write-Host ''

Write-Host '=== gmail-sync (fresh device, expect 404 not_connected) ===' -ForegroundColor Cyan
$r = PostJson "$base/gmail-sync" @{ device_id = $dev }
Write-Host "STATUS: $($r.status)"
Write-Host "BODY: $($r.body)"
Write-Host ''

Write-Host '=== gmail-disconnect (no row, expect 200 disconnected:true) ===' -ForegroundColor Cyan
$r = PostJson "$base/gmail-disconnect" @{ device_id = $dev }
Write-Host "STATUS: $($r.status)"
Write-Host "BODY: $($r.body)"
