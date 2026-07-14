param([int]$Port = 8765)

$Root = Split-Path -Parent $PSScriptRoot
$Prefix = "http://127.0.0.1:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Prefix)

$mime = @{
 ".html"="text/html; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
 ".css"="text/css; charset=utf-8"; ".json"="application/json; charset=utf-8";
 ".svg"="image/svg+xml"; ".png"="image/png"; ".jpg"="image/jpeg";
 ".jpeg"="image/jpeg"; ".webp"="image/webp"; ".ico"="image/x-icon";
 ".woff"="font/woff"; ".woff2"="font/woff2"
}

try {
 $listener.Start()
 Start-Process $Prefix
 Write-Host "ReasonForge is running at $Prefix"
 Write-Host "Keep this window open while using the app. Press Ctrl+C to stop."
 while ($listener.IsListening) {
  $context = $listener.GetContext()
  try {
   $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
   if ([string]::IsNullOrWhiteSpace($relative)) { $relative = "index.html" }
   $candidate = [IO.Path]::GetFullPath((Join-Path $Root $relative))
   if (-not $candidate.StartsWith([IO.Path]::GetFullPath($Root), [StringComparison]::OrdinalIgnoreCase)) {
    $context.Response.StatusCode = 403
   } elseif (Test-Path $candidate -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($candidate)
    $ext = [IO.Path]::GetExtension($candidate).ToLowerInvariant()
    $context.Response.ContentType = $(if($mime.ContainsKey($ext)){$mime[$ext]}else{"application/octet-stream"})
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
   } else {
    $context.Response.StatusCode = 404
   }
  } catch {
   $context.Response.StatusCode = 500
  } finally {
   $context.Response.OutputStream.Close()
  }
 }
} finally {
 if ($listener.IsListening) { $listener.Stop() }
 $listener.Close()
}
