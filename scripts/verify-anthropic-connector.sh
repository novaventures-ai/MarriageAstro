#!/bin/bash
# Anthropic MCP Connector Verification Script
# Run this before submitting to ensure all requirements are met

set -e

BASE_URL="${1:-https://marriage-astro.vercel.app}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Anthropic MCP Connector Verification"
echo "Base URL: $BASE_URL"
echo "========================================"
echo ""

PASS=0
FAIL=0

check_endpoint() {
    local url=$1
    local description=$2
    local expected_content_type=$3
    
    echo -n "Checking: $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}|%{content_type}" "$url" 2>/dev/null || echo "000|error")
    http_code=$(echo "$response" | cut -d'|' -f1)
    content_type=$(echo "$response" | cut -d'|' -f2)
    
    if [ "$http_code" = "200" ]; then
        if [ -n "$expected_content_type" ] && [[ ! "$content_type" =~ "$expected_content_type" ]]; then
            echo -e "${RED}FAIL${NC} (HTTP $http_code, wrong content-type: $content_type)"
            ((FAIL++))
        else
            echo -e "${GREEN}PASS${NC} (HTTP $http_code)"
            ((PASS++))
        fi
    else
        echo -e "${RED}FAIL${NC} (HTTP $http_code)"
        ((FAIL++))
    fi
}

check_json_validity() {
    local file=$1
    local description=$2
    
    echo -n "Validating: $description... "
    
    if python -m json.tool "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}FAIL${NC} (Invalid JSON)"
        ((FAIL++))
    fi
}

echo "📡 Endpoint Availability Checks"
echo "----------------------------------------"

check_endpoint "$BASE_URL" "Main Website" "text/html"
check_endpoint "$BASE_URL/.well-known/mcp/server-card.json" "Server Card" "application/json"
check_endpoint "$BASE_URL/.well-known/mcp/icon.png" "Icon Image" "image/png"
check_endpoint "$BASE_URL/.well-known/mcp/anthropic-connector-manifest.json" "Connector Manifest" "application/json"
check_endpoint "$BASE_URL/api/oauth" "OAuth Endpoint" "application/json"
check_endpoint "$BASE_URL/api/mcp" "MCP Endpoint" ""

echo ""
echo "📄 Local File Validation"
echo "----------------------------------------"

if [ -f "public/.well-known/mcp/server-card.json" ]; then
    check_json_validity "public/.well-known/mcp/server-card.json" "Server Card JSON"
else
    echo -e "${RED}MISSING${NC}: server-card.json not found"
    ((FAIL++))
fi

if [ -f "public/.well-known/mcp/anthropic-connector-manifest.json" ]; then
    check_json_validity "public/.well-known/mcp/anthropic-connector-manifest.json" "Connector Manifest JSON"
else
    echo -e "${RED}MISSING${NC}: anthropic-connector-manifest.json not found"
    ((FAIL++))
fi

if [ -f "public/.well-known/mcp/icon.png" ]; then
    echo -n "Checking: Icon file exists... "
    icon_size=$(stat -f%z "public/.well-known/mcp/icon.png" 2>/dev/null || stat -c%s "public/.well-known/mcp/icon.png" 2>/dev/null)
    if [ "$icon_size" -gt 0 ]; then
        echo -e "${GREEN}PASS${NC} ($icon_size bytes)"
        ((PASS++))
    else
        echo -e "${RED}FAIL${NC} (Empty file)"
        ((FAIL++))
    fi
else
    echo -e "${RED}MISSING${NC}: icon.png not found"
    ((FAIL++))
fi

echo ""
echo "🔐 OAuth Configuration Check"
echo "----------------------------------------"

echo -n "Checking: OAuth endpoint returns metadata... "
oauth_response=$(curl -s "$BASE_URL/api/oauth" 2>/dev/null)
if echo "$oauth_response" | grep -q "name"; then
    echo -e "${GREEN}PASS${NC}"
    ((PASS++))
else
    echo -e "${RED}FAIL${NC} (No metadata returned)"
    ((FAIL++))
fi

echo ""
echo "🛡️  Security Headers Check"
echo "----------------------------------------"

echo -n "Checking: HTTPS redirect... "
http_response=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" "http://marriage-astro.vercel.app" 2>/dev/null || echo "000|")
if [[ "$http_response" =~ "https://" ]] || [ "$(echo "$http_response" | cut -d'|' -f1)" = "000" ]; then
    echo -e "${GREEN}PASS${NC} (HTTPS enforced or domain not responding to HTTP)"
    ((PASS++))
else
    echo -e "${YELLOW}WARN${NC} (Check manual HTTPS configuration)"
fi

echo ""
echo "========================================"
echo "Summary"
echo "========================================"
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for submission.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Email mcp-review@anthropic.com with submission details"
    echo "2. See docs/ANTHROPIC_SUBMISSION.md for email template"
    echo "3. Deploy any pending changes to Vercel"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix issues before submitting.${NC}"
    echo ""
    echo "Review the failures above and update your deployment."
    exit 1
fi
