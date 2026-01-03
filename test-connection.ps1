# Test Supabase Connection

Write-Host "Testing database connection..."
Write-Host ""

# Load .env file
$envFile = Get-Content .env
$dbUrl = ($envFile | Select-String "DATABASE_URL").Line -replace 'DATABASE_URL=', '' -replace '"', ''

Write-Host "Connection string format: $($dbUrl.Substring(0, [Math]::Min(50, $dbUrl.Length)))..."
Write-Host ""

# Try to connect
Write-Host "Attempting to connect..."
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Connection successful! Database is ready."
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Restart your server: npm run dev"
    Write-Host "2. Go to http://localhost:3000/auth/signup"
    Write-Host "3. Create your account"
} else {
    Write-Host ""
    Write-Host "❌ Connection failed. Please check:"
    Write-Host "1. Supabase project is active (not paused)"
    Write-Host "2. Connection string is correct"
    Write-Host "3. Password is correct"
    Write-Host ""
    Write-Host "See SUPABASE_SETUP.md for detailed instructions"
}







