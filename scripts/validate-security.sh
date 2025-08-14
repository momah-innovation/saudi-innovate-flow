#!/bin/bash

# Saudi Innovate Security Validation Script
# Comprehensive security audit and validation for production deployment

echo "🔒 Saudi Innovate Security Validation"
echo "======================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print status
print_status() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    case $status in
        "PASS")
            echo -e "${GREEN}✅ PASS${NC} - $test_name: $message"
            ((PASSED++))
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC} - $test_name: $message"
            ((FAILED++))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC} - $test_name: $message"
            ((WARNINGS++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO${NC} - $test_name: $message"
            ;;
    esac
}

echo ""
echo "🔍 1. Secrets Scan"
echo "=================="

# Check for hardcoded Supabase URLs and keys
if grep -r --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" -E "jxpbiljkoibvqxzdkgod\.supabase\.co|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ > /dev/null 2>&1; then
    print_status "Hardcoded Secrets" "FAIL" "Found hardcoded Supabase URLs or keys in src/"
    echo "   Run: grep -r -n 'jxpbiljkoibvqxzdkgod\|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' src/"
else
    print_status "Hardcoded Secrets" "PASS" "No hardcoded secrets found in src/"
fi

# Check for console.log statements (should be replaced with debugLog)
if grep -r --exclude-dir=node_modules --include="*.ts" --include="*.tsx" "console\." src/ > /dev/null 2>&1; then
    print_status "Console Statements" "WARN" "Found console statements (should use debugLog in production)"
    CONSOLE_COUNT=$(grep -r --exclude-dir=node_modules --include="*.ts" --include="*.tsx" "console\." src/ | wc -l)
    echo "   Found $CONSOLE_COUNT console statements"
else
    print_status "Console Statements" "PASS" "No console statements found"
fi

echo ""
echo "🌍 2. Environment Configuration"
echo "==============================="

# Check for .env.example
if [ -f ".env.example" ]; then
    print_status ".env.example" "PASS" "Environment example file exists"
else
    print_status ".env.example" "FAIL" "Missing .env.example file"
fi

# Check if environment variables are properly structured
if grep -q "VITE_SUPABASE_URL" .env.example 2>/dev/null && grep -q "VITE_SUPABASE_ANON_KEY" .env.example 2>/dev/null; then
    print_status "Environment Structure" "PASS" "Required environment variables documented"
else
    print_status "Environment Structure" "FAIL" "Missing required environment variable documentation"
fi

echo ""
echo "🔧 3. Build and Compilation"
echo "============================"

# Check TypeScript compilation
if npx tsc --noEmit > /dev/null 2>&1; then
    print_status "TypeScript Compilation" "PASS" "No TypeScript errors"
else
    print_status "TypeScript Compilation" "FAIL" "TypeScript compilation errors found"
    echo "   Run: npx tsc --noEmit"
fi

# Check if build succeeds
if npm run build > /dev/null 2>&1; then
    print_status "Build Process" "PASS" "Application builds successfully"
else
    print_status "Build Process" "FAIL" "Build process failed"
    echo "   Run: npm run build"
fi

echo ""
echo "🧪 4. Testing Infrastructure"
echo "============================="

# Check for test files
if find src/ -name "*.test.ts" -o -name "*.test.tsx" | grep -q .; then
    print_status "Test Files" "PASS" "Test files found"
    TEST_COUNT=$(find src/ -name "*.test.ts" -o -name "*.test.tsx" | wc -l)
    echo "   Found $TEST_COUNT test files"
else
    print_status "Test Files" "WARN" "No test files found"
fi

# Check for vitest config
if [ -f "vitest.config.ts" ]; then
    print_status "Test Configuration" "PASS" "Vitest configuration exists"
else
    print_status "Test Configuration" "WARN" "Missing vitest.config.ts"
fi

echo ""
echo "🛡️  5. Security Components"
echo "=========================="

# Check for security utilities
if [ -f "src/utils/debugLogger.ts" ]; then
    print_status "Debug Logger" "PASS" "Security-aware logger implemented"
else
    print_status "Debug Logger" "FAIL" "Missing debug logger utility"
fi

if [ -f "src/utils/securityAudit.ts" ]; then
    print_status "Security Audit" "PASS" "Security audit utility exists"
else
    print_status "Security Audit" "WARN" "Missing security audit utility"
fi

if [ -f "src/utils/serverAuth.ts" ]; then
    print_status "Server Auth" "PASS" "Server authentication utility exists"
else
    print_status "Server Auth" "FAIL" "Missing server authentication utility"
fi

echo ""
echo "🚀 6. Production Readiness"
echo "=========================="

# Check for production optimization utilities
if [ -f "src/utils/productionValidator.ts" ]; then
    print_status "Production Validator" "PASS" "Production validation utility exists"
else
    print_status "Production Validator" "WARN" "Missing production validation utility"
fi

if [ -f "src/utils/productionOptimizer.ts" ]; then
    print_status "Production Optimizer" "PASS" "Production optimization utility exists"
else
    print_status "Production Optimizer" "WARN" "Missing production optimization utility"
fi

# Check for error boundaries
if grep -r "ErrorBoundary" src/ > /dev/null 2>&1; then
    print_status "Error Boundaries" "PASS" "Error boundary implementation found"
else
    print_status "Error Boundaries" "WARN" "No error boundary implementation found"
fi

echo ""
echo "📊 7. Documentation and Compliance"
echo "==================================="

# Check for implementation documentation
if [ -f "docs/IMPLEMENTATION_PROGRESS.md" ]; then
    print_status "Implementation Docs" "PASS" "Implementation progress documented"
else
    print_status "Implementation Docs" "FAIL" "Missing implementation documentation"
fi

if [ -f "docs/FINAL_SECURITY_DOCUMENTATION.md" ]; then
    print_status "Security Documentation" "PASS" "Security documentation exists"
else
    print_status "Security Documentation" "WARN" "Missing security documentation"
fi

echo ""
echo "📋 VALIDATION SUMMARY"
echo "====================="
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

TOTAL=$((PASSED + FAILED + WARNINGS))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 VALIDATION SUCCESSFUL!${NC}"
    echo -e "Success rate: ${GREEN}$SUCCESS_RATE%${NC}"
    echo "✅ Saudi Innovate is ready for production deployment"
    exit 0
else
    echo -e "${RED}🚨 VALIDATION FAILED!${NC}"
    echo -e "Success rate: ${RED}$SUCCESS_RATE%${NC}"
    echo "❌ Please address the failed checks before deployment"
    exit 1
fi