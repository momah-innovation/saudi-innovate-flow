#!/bin/bash

# Saudi Innovate Build and Test Validation Script
# Comprehensive validation for all build and test requirements

echo "🚀 Saudi Innovate Build & Test Validation"
echo "=========================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

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
    esac
}

echo ""
echo "🔧 1. Dependencies and Environment"
echo "=================================="

# Check Node.js version
NODE_VERSION=$(node --version)
if [[ "$NODE_VERSION" =~ ^v(18|20|21) ]]; then
    print_status "Node.js Version" "PASS" "Compatible Node.js version: $NODE_VERSION"
else
    print_status "Node.js Version" "WARN" "Node.js version $NODE_VERSION may not be optimal"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status "Dependencies" "PASS" "Dependencies installed"
else
    print_status "Dependencies" "FAIL" "Dependencies not installed - run npm install"
fi

# Check package.json scripts
if grep -q "\"build\"" package.json && grep -q "\"test\"" package.json; then
    print_status "Package Scripts" "PASS" "Required scripts defined"
else
    print_status "Package Scripts" "FAIL" "Missing required package.json scripts"
fi

echo ""
echo "📝 2. TypeScript Validation"
echo "============================"

# TypeScript compilation check
echo "Checking TypeScript compilation..."
if npx tsc --noEmit 2>&1 | tee /tmp/tsc_output.log; then
    if [ ! -s /tmp/tsc_output.log ]; then
        print_status "TypeScript Compilation" "PASS" "No TypeScript errors"
    else
        ERROR_COUNT=$(wc -l < /tmp/tsc_output.log)
        print_status "TypeScript Compilation" "FAIL" "$ERROR_COUNT TypeScript errors found"
        echo "   See output above for details"
    fi
else
    print_status "TypeScript Compilation" "FAIL" "TypeScript compilation failed"
fi

echo ""
echo "🏗️  3. Build Process"
echo "==================="

# Clean build
echo "Running clean build..."
if npm run build > /tmp/build_output.log 2>&1; then
    print_status "Production Build" "PASS" "Build completed successfully"
    
    # Check build output directory
    if [ -d "dist" ]; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        print_status "Build Output" "PASS" "Build directory created (Size: $BUILD_SIZE)"
    else
        print_status "Build Output" "WARN" "Build directory not found"
    fi
else
    print_status "Production Build" "FAIL" "Build process failed"
    echo "   Check /tmp/build_output.log for details"
fi

# Check for source maps in production
if find dist -name "*.map" 2>/dev/null | grep -q .; then
    print_status "Source Maps" "WARN" "Source maps found in production build"
else
    print_status "Source Maps" "PASS" "No source maps in production build"
fi

echo ""
echo "🧪 4. Testing Infrastructure"
echo "============================="

# Check test configuration
if [ -f "vitest.config.ts" ]; then
    print_status "Test Config" "PASS" "Vitest configuration found"
else
    print_status "Test Config" "FAIL" "Missing vitest.config.ts"
fi

# Check test setup
if [ -f "src/test/setup.ts" ]; then
    print_status "Test Setup" "PASS" "Test setup file exists"
else
    print_status "Test Setup" "WARN" "Missing test setup file"
fi

# Count test files
TEST_COUNT=$(find src -name "*.test.ts" -o -name "*.test.tsx" | wc -l)
if [ $TEST_COUNT -gt 0 ]; then
    print_status "Test Files" "PASS" "$TEST_COUNT test files found"
else
    print_status "Test Files" "WARN" "No test files found"
fi

# Run tests if they exist
if [ $TEST_COUNT -gt 0 ]; then
    echo "Running tests..."
    if npm run test > /tmp/test_output.log 2>&1; then
        print_status "Test Execution" "PASS" "All tests passed"
    else
        print_status "Test Execution" "FAIL" "Some tests failed"
        echo "   Check /tmp/test_output.log for details"
    fi
fi

echo ""
echo "🔍 5. Code Quality"
echo "=================="

# Check for linting
if grep -q "lint" package.json; then
    if npm run lint > /tmp/lint_output.log 2>&1; then
        print_status "Linting" "PASS" "Code linting passed"
    else
        print_status "Linting" "WARN" "Linting issues found"
    fi
else
    print_status "Linting" "WARN" "No linting configuration found"
fi

# Check for TypeScript strict mode
if grep -q "\"strict\": true" tsconfig.json; then
    print_status "TypeScript Strict Mode" "PASS" "Strict mode enabled"
else
    print_status "TypeScript Strict Mode" "WARN" "TypeScript strict mode not enabled"
fi

echo ""
echo "🚀 6. Performance Checks"
echo "========================"

# Check bundle size (if dist exists)
if [ -d "dist" ]; then
    # Find main JS bundle
    MAIN_BUNDLE=$(find dist -name "index-*.js" | head -1)
    if [ -n "$MAIN_BUNDLE" ]; then
        BUNDLE_SIZE=$(stat -f%z "$MAIN_BUNDLE" 2>/dev/null || stat -c%s "$MAIN_BUNDLE" 2>/dev/null)
        BUNDLE_SIZE_MB=$((BUNDLE_SIZE / 1024 / 1024))
        
        if [ $BUNDLE_SIZE_MB -lt 2 ]; then
            print_status "Bundle Size" "PASS" "Main bundle size: ${BUNDLE_SIZE_MB}MB (Good)"
        elif [ $BUNDLE_SIZE_MB -lt 5 ]; then
            print_status "Bundle Size" "WARN" "Main bundle size: ${BUNDLE_SIZE_MB}MB (Consider optimization)"
        else
            print_status "Bundle Size" "FAIL" "Main bundle size: ${BUNDLE_SIZE_MB}MB (Too large)"
        fi
    fi
fi

# Check for lazy loading implementation
if grep -r "React.lazy\|lazy(" src/ > /dev/null 2>&1; then
    print_status "Lazy Loading" "PASS" "Lazy loading implemented"
else
    print_status "Lazy Loading" "WARN" "No lazy loading detected"
fi

echo ""
echo "🛡️  7. Security Validation"
echo "=========================="

# Run security validation script if it exists
if [ -f "scripts/validate-security.sh" ]; then
    print_status "Security Script" "PASS" "Security validation script exists"
    echo "Running security validation..."
    if bash scripts/validate-security.sh > /tmp/security_output.log 2>&1; then
        print_status "Security Validation" "PASS" "Security checks passed"
    else
        print_status "Security Validation" "WARN" "Security checks have warnings"
    fi
else
    print_status "Security Script" "WARN" "No security validation script found"
fi

echo ""
echo "📊 VALIDATION SUMMARY"
echo "====================="
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

TOTAL=$((PASSED + FAILED + WARNINGS))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 BUILD & TEST VALIDATION SUCCESSFUL!${NC}"
    echo -e "Success rate: ${GREEN}$SUCCESS_RATE%${NC}"
    if [ $WARNINGS -eq 0 ]; then
        echo "✅ Perfect score! Ready for production deployment"
    else
        echo "✅ Ready for deployment (review warnings for optimization)"
    fi
    exit 0
else
    echo -e "${RED}🚨 BUILD & TEST VALIDATION FAILED!${NC}"
    echo -e "Success rate: ${RED}$SUCCESS_RATE%${NC}"
    echo "❌ Please address the failed checks before deployment"
    exit 1
fi