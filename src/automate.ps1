param(
    [Parameter(Mandatory=$true)]
    [string]$SourceFolder,
    [string]$OutputFolder = $SourceFolder
)

# Ensure output folder exists
New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null

# Get all Word files
$wordFiles = Get-ChildItem -Path $SourceFolder -Include *.docx, *.doc -Recurse

if ($wordFiles.Count -eq 0) {
    Write-Host "❌ No Word files found in $SourceFolder" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Found $($wordFiles.Count) Word files. Converting to PDF..." -ForegroundColor Cyan

# Create Word COM object
$wordApp = New-Object -ComObject Word.Application
$wordApp.Visible = $false
$wordApp.DisplayAlerts = "wdAlertsNone"

$successCount = 0
$errorCount = 0

foreach ($file in $wordFiles) {
    $pdfPath = Join-Path $OutputFolder ($file.BaseName + ".pdf")
    Write-Host "  → Converting $($file.Name)..." -ForegroundColor Gray -NoNewline

    try {
        # Open document
        $doc = $wordApp.Documents.Open($file.FullName)
        
        # Save as PDF
        $doc.SaveAs([ref]$pdfPath, [ref]17)  # 17 = wdFormatPDF
        
        # Close document
        $doc.Close([ref]$false)
        
        Write-Host " ✅" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host " ❌ $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

# Quit Word
$wordApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wordApp) | Out-Null
Remove-Variable wordApp

Write-Host ""
Write-Host "🎉 Conversion Complete!" -ForegroundColor Green
Write-Host "   ✅ Success: $successCount" -ForegroundColor Green
Write-Host "   ❌ Failed:  $errorCount" -ForegroundColor Red
Write-Host "📁 Output: $OutputFolder" -ForegroundColor Cyan