# PowerShell script to set Resend API key in Supabase
# Run this script after installing Supabase CLI and linking your project

Write-Host "Setting Resend API Key in Supabase Edge Function Secrets..." -ForegroundColor Green

# Set Resend API Key Secret
Write-Host "`n1. Setting RESEND_API_KEY..." -ForegroundColor Yellow
supabase secrets set RESEND_API_KEY=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7

# Set optional secrets (Note: Cannot use SUPABASE_ prefix - reserved by Supabase)
Write-Host "`n2. Setting FROM_EMAIL..." -ForegroundColor Yellow
supabase secrets set FROM_EMAIL=send@brnnd.com

Write-Host "`n3. Setting FROM_NAME..." -ForegroundColor Yellow
supabase secrets set FROM_NAME=brnnd

# Deploy Edge Function
Write-Host "`n4. Deploying Edge Function..." -ForegroundColor Yellow
supabase functions deploy send-invoice-email

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Go to /settings in your app" -ForegroundColor White
Write-Host "2. Click 'Send Test Email' to verify" -ForegroundColor White
Write-Host "3. Create an invoice - it will automatically send email!" -ForegroundColor White

