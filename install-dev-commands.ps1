# Installs convenient PowerShell commands for this repository.
# Run once after pulling: .\install-dev-commands.ps1
# Database credentials are never stored in this file.

$repoRoot = (Resolve-Path $PSScriptRoot).Path
$profilePath = $PROFILE
$profileDirectory = Split-Path -Parent $profilePath

if (-not (Test-Path $profileDirectory)) {
    New-Item -ItemType Directory -Path $profileDirectory -Force | Out-Null
}
if (-not (Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
}

$beginMarker = '# >>> TravelBookingPortal commands >>>'
$endMarker = '# <<< TravelBookingPortal commands <<<'
$profileContent = Get-Content -Path $profilePath -Raw -ErrorAction SilentlyContinue
if ($null -eq $profileContent) { $profileContent = '' }

# Remove an earlier installation block, making this installer safe to rerun.
$escapedBegin = [regex]::Escape($beginMarker)
$escapedEnd = [regex]::Escape($endMarker)
$pattern = "(?s)\r?\n?$escapedBegin.*?$escapedEnd\r?\n?"
$profileContent = [regex]::Replace($profileContent, $pattern, "`r`n")
$quotedRepoRoot = $repoRoot.Replace("'", "''")

$commandBlock = @"
$beginMarker
`$env:TRAVEL_BOOKING_PORTAL_ROOT = '$quotedRepoRoot'

function start-backend {
    if (-not `$env:TRAVEL_BOOKING_PORTAL_ROOT -or
        -not (Test-Path (Join-Path `$env:TRAVEL_BOOKING_PORTAL_ROOT 'springapp'))) {
        Write-Error 'TravelBookingPortal folder not found. Rerun install-dev-commands.ps1 from the repository root.'
        return
    }

    Set-Location (Join-Path `$env:TRAVEL_BOOKING_PORTAL_ROOT 'springapp')

    # The backend reads DB_PASSWORD. Prompt securely if it is not set.
    if (-not `$env:DB_PASSWORD) {
        `$securePassword = Read-Host 'Enter your local MySQL password (input hidden)' -AsSecureString
        `$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR(`$securePassword)
        try {
            `$env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(`$passwordPointer)
        }
        finally {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR(`$passwordPointer)
        }
    }

    if (Test-Path '.\mvnw.cmd') {
        & .\mvnw.cmd spring-boot:run
    }
    else {
        mvn spring-boot:run
    }
}

function start-frontend {
    if (-not `$env:TRAVEL_BOOKING_PORTAL_ROOT -or
        -not (Test-Path (Join-Path `$env:TRAVEL_BOOKING_PORTAL_ROOT 'reactapp'))) {
        Write-Error 'TravelBookingPortal folder not found. Rerun install-dev-commands.ps1 from the repository root.'
        return
    }

    Set-Location (Join-Path `$env:TRAVEL_BOOKING_PORTAL_ROOT 'reactapp')
    npm start
}
$endMarker
"@

Set-Content -Path $profilePath -Value ($profileContent.TrimEnd() + "`r`n`r`n" + $commandBlock + "`r`n") -Encoding UTF8

Write-Host 'Installed start-backend and start-frontend.'
Write-Host 'Close and reopen PowerShell, or run: . $PROFILE'
Write-Host 'Then run start-backend or start-frontend from any directory.'
