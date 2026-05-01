$uri = "https://nsmwgokjjnpwwvearwxf.supabase.co/functions/v1/vibe-builder"
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbXdnb2tqam5wd3d2ZWFyd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTY4MjIsImV4cCI6MjA5MjkzMjgyMn0.CRuLwGQNFwhbEQ5JEx-a-bN3orjEh6OIwMgLUgDFgxY"
$headers = @{ "apikey" = $key; "Authorization" = "Bearer $key"; "Content-Type" = "application/json" }
$bodyObj = @{
    device_id = "test-lisbon-couple"
    destination = "Lisbon"
    start_date = "2026-06-15"
    end_date = "2026-06-18"
    group = "couple in our 30s, foodies"
    budget = "mid-range, will splurge for one big dinner"
    style = "slow and local - neighborhoods over landmarks"
    loves = "natural wine, pastel de nata, fado, vintage shops, walking everywhere"
    hates = "lines, tourist traps, super-loud restaurants"
    limits = "no nuts (allergy)"
}
$body = $bodyObj | ConvertTo-Json -Compress

Write-Host "Calling vibe-builder for Lisbon long weekend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop -TimeoutSec 60
    Write-Host "STATUS: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | Out-File -FilePath "scripts/data/vibe-lisbon-result.json" -Encoding utf8
    Write-Host "Wrote scripts/data/vibe-lisbon-result.json"
    $parsed = $response.Content | ConvertFrom-Json
    Write-Host "parsed=$($parsed.parsed) days=$($parsed.brief.days.Count) hiddenGems=$($parsed.brief.hiddenGems.Count) bookAhead=$($parsed.brief.bookInAdvance.Count) avoid=$($parsed.brief.avoid.Count)"
} catch [System.Net.WebException] {
    $resp = $_.Exception.Response
    if ($resp -ne $null) {
        Write-Host "STATUS: $([int]$resp.StatusCode)" -ForegroundColor Red
        $stream = $resp.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host $reader.ReadToEnd()
    } else { Write-Host "Network error: $($_.Exception.Message)" -ForegroundColor Red }
} catch {
    Write-Host "Other error: $($_.Exception.Message)" -ForegroundColor Red
}
