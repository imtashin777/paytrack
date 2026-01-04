Write-Host "🔧 Fixing Signup Page Error..." -ForegroundColor Cyan
Write-Host ""

# Stop any running Node processes
Write-Host "1. Stopping any running servers..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clear Next.js cache
Write-Host "2. Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
Write-Host "   ✅ Cache cleared" -ForegroundColor Green

# Regenerate Prisma client
Write-Host "3. Regenerating Prisma client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "   ✅ Prisma client generated" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Ready! Now start the server:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then wait 10-15 seconds for the build to complete," -ForegroundColor Yellow
Write-Host "then go to: http://localhost:3000/auth/signup" -ForegroundColor Yellow









