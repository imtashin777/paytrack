# PowerShell script to create .env file

$envContent = @"
# Database - Replace with your actual database URL
# For Supabase: Get connection string from Settings > Database
# For local PostgreSQL: postgresql://user:password@localhost:5432/paytrack?schema=public
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/paytrack?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paytrack-secret-key-change-this-in-production"

# Stripe (Optional - for subscriptions)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
"@

if (Test-Path .env) {
    Write-Host ".env file already exists. Skipping creation."
} else {
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ .env file created successfully!"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Update DATABASE_URL with your actual database connection string"
    Write-Host "   For Supabase: Get it from Settings > Database"
}










