$uri = "https://nsmwgokjjnpwwvearwxf.supabase.co/functions/v1/vibe-builder"
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbXdnb2tqam5wd3d2ZWFyd3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTY4MjIsImV4cCI6MjA5MjkzMjgyMn0.CRuLwGQNFwhbEQ5JEx-a-bN3orjEh6OIwMgLUgDFgxY"
$headers = @{ "apikey" = $key; "Authorization" = "Bearer $key"; "Content-Type" = "application/json" }
$body = '{"device_id":"test-1","destination":"Lisbon","start_date":"2026-06-15","end_date":"2026-06-18"}'

Write-Host "Calling vibe-builder..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop
    Write-Host "STATUS: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "BODY:"
    Write-Host $response.Content
} catch [System.Net.WebException] {
    $resp = $_.Exception.Response
    if ($resp -ne $null) {
        Write-Host "STATUS: $([int]$resp.StatusCode)" -ForegroundColor Red
        $stream = $resp.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "BODY:" -ForegroundColor Red
        Write-Host $body
    } else {
        Write-Host "Network error: $($_.Exception.Message)" -ForegroundColor Red
    }
} catch {
    Write-Host "Other error: $($_.Exception.Message)" -ForegroundColor Red
}
