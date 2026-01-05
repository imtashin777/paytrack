# PowerShell script to help update DATABASE_URL

Write-Host "========================================"
Write-Host "  PayTrack - Database Setup Helper"
Write-Host "========================================"
Write-Host ""

Write-Host "Choose your database option:"
Write-Host "1. Supabase (Recommended - Free, Easy)"
Write-Host "2. Local PostgreSQL"
Write-Host "3. Just update .env file manually"
Write-Host ""

$choice = Read-Host "Enter choice (1, 2, or 3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "📝 Supabase Setup Instructions:"
    Write-Host "1. Go to https://supabase.com"
    Write-Host "2. Sign up and create a new project"
    Write-Host "3. Go to Settings > Database"
    Write-Host "4. Copy the 'URI' connection string"
    Write-Host ""
    $dbUrl = Read-Host "Paste your Supabase connection string here"
    
    if ($dbUrl) {
        $envContent = @"
# Database - Supabase
DATABASE_URL="$dbUrl"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paytrack-secret-key-change-this-in-production"

# Stripe (Optional - for subscriptions)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
"@
        $envContent | Out-File -FilePath .env -Encoding utf8
        Write-Host ""
        Write-Host "✅ .env file updated with Supabase connection!"
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "1. Run: npx prisma db push"
        Write-Host "2. Restart your server: npm run dev"
    }
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Enter your local PostgreSQL details:"
    $username = Read-Host "Username (default: postgres)"
    if (-not $username) { $username = "postgres" }
    $password = Read-Host "Password"
    $host = Read-Host "Host (default: localhost)"
    if (-not $host) { $host = "localhost" }
    $port = Read-Host "Port (default: 5432)"
    if (-not $port) { $port = "5432" }
    
    $dbUrl = "postgresql://${username}:${password}@${host}:${port}/paytrack?schema=public"
    
    $envContent = @"
# Database - Local PostgreSQL
DATABASE_URL="$dbUrl"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paytrack-secret-key-change-this-in-production"

# Stripe (Optional - for subscriptions)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
"@
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host ""
    Write-Host "✅ .env file updated!"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Make sure PostgreSQL is running"
    Write-Host "2. Create database: CREATE DATABASE paytrack;"
    Write-Host "3. Run: npx prisma db push"
    Write-Host "4. Restart your server: npm run dev"
}
else {
    Write-Host ""
    Write-Host "📝 Manual Update Instructions:"
    Write-Host "1. Open .env file in your editor"
    Write-Host "2. Update DATABASE_URL with your connection string"
    Write-Host "3. Save the file"
    Write-Host "4. Restart your server"
}










