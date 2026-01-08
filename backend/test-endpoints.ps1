# PowerShell script to test API endpoints

$baseUrl = "http://localhost:3000"

Write-Host "🧪 Testing Authentication Endpoints`n" -ForegroundColor Cyan

# Test 1: Register a new user
Write-Host "1. Testing POST /api/auth/register" -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "Password123"
    name = "Test User"
    role = "student"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -SessionVariable session
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "   Email: $($registerResponse.user.email)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Error: $($errorObj.message)`n" -ForegroundColor Red
    }
}

# Test 2: Login
Write-Host "2. Testing POST /api/auth/login" -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "Password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $session
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Logged in as: $($loginResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($loginResponse.user.role)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Error: $($errorObj.message)`n" -ForegroundColor Red
    }
}

# Test 3: Get current user (requires session)
Write-Host "3. Testing GET /api/auth/me" -ForegroundColor Yellow
try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -WebSession $session
    Write-Host "✅ Get current user successful!" -ForegroundColor Green
    Write-Host "   User: $($meResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($meResponse.user.role)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get current user failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Error: $($errorObj.message)`n" -ForegroundColor Red
    }
}

# Test 4: Test protected route
Write-Host "4. Testing GET /api/auth/profile" -ForegroundColor Yellow
try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method Get -WebSession $session
    Write-Host "✅ Profile access successful!" -ForegroundColor Green
    Write-Host "   Profile: $($profileResponse.user.email)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Profile access failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Logout
Write-Host "5. Testing POST /api/auth/logout" -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/logout" -Method Post -WebSession $session
    Write-Host "✅ Logout successful!" -ForegroundColor Green
    Write-Host "   Message: $($logoutResponse.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "✅ All tests completed!" -ForegroundColor Cyan
