#!/bin/bash

# Environment Verification Script for Eventz Multi-Site Setup
# Usage: ./scripts/verify-env.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Eventz Environment Configuration Validator${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Function to check if variable is set
check_env_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name=" .env 2>/dev/null | cut -d'=' -f2)

    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name is not set"
        ERRORS=$((ERRORS + 1))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name is set"
        return 0
    fi
}

# Function to check if files exist
check_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
        return 0
    else
        echo -e "${RED}✗${NC} $file not found"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo -e "${YELLOW}Checking .env configuration...${NC}"
check_env_var "NEXT_PUBLIC_FIREBASE_API_KEY"
check_env_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
check_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
check_env_var "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
check_env_var "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
check_env_var "NEXT_PUBLIC_FIREBASE_APP_ID"
check_env_var "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
check_env_var "NEXT_PUBLIC_ADMIN_WALLET_ADDRESS"
echo ""

echo -e "${YELLOW}Checking Firebase configuration files...${NC}"
check_file ".firebaserc"
check_file "firebase.json"
check_file "firestore.rules"
check_file "firestore.indexes.json"
check_file "storage.rules"
echo ""

echo -e "${YELLOW}Checking configuration consistency...${NC}"

# Get values from .env
PROJECT_ID=$(grep "^NEXT_PUBLIC_FIREBASE_PROJECT_ID=" .env 2>/dev/null | cut -d'=' -f2)
STORAGE_BUCKET=$(grep "^NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=" .env 2>/dev/null | cut -d'=' -f2)

# Get Firebase CLI project
FB_PROJECT=$(firebase use 2>/dev/null | tail -n 1)

# Get firebase.json storage bucket
FB_JSON_BUCKET=$(grep '"bucket":' firebase.json 2>/dev/null | sed 's/.*"bucket": "\(.*\)".*/\1/')

# Check if .env PROJECT_ID matches Firebase CLI project
if [ "$PROJECT_ID" == "$FB_PROJECT" ]; then
    echo -e "${GREEN}✓${NC} .env PROJECT_ID matches Firebase CLI project ($PROJECT_ID)"
else
    echo -e "${RED}✗${NC} Mismatch: .env has '$PROJECT_ID' but Firebase CLI uses '$FB_PROJECT'"
    ERRORS=$((ERRORS + 1))
fi

# Check if .env STORAGE_BUCKET matches firebase.json
if [ "$STORAGE_BUCKET" == "$FB_JSON_BUCKET" ]; then
    echo -e "${GREEN}✓${NC} .env STORAGE_BUCKET matches firebase.json ($STORAGE_BUCKET)"
else
    echo -e "${RED}✗${NC} Mismatch: .env has '$STORAGE_BUCKET' but firebase.json has '$FB_JSON_BUCKET'"
    ERRORS=$((ERRORS + 1))
fi

# Check if .firebaserc matches Firebase CLI
FIREBASERC_PROJECT=$(grep '"default":' .firebaserc 2>/dev/null | sed 's/.*"default": "\(.*\)".*/\1/')
if [ "$FIREBASERC_PROJECT" == "$FB_PROJECT" ]; then
    echo -e "${GREEN}✓${NC} .firebaserc matches Firebase CLI project ($FIREBASERC_PROJECT)"
else
    echo -e "${YELLOW}⚠${NC} Warning: .firebaserc has '$FIREBASERC_PROJECT' but Firebase CLI uses '$FB_PROJECT'"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check for security issues
echo -e "${YELLOW}Checking security configuration...${NC}"

# Check if development rules are active
if grep -q "allow read, write: if true" firestore.rules 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} Warning: Firestore has development rules (allow all access)"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} Firestore rules appear to be production-ready"
fi

if grep -q "allow read, write: if true" storage.rules 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} Warning: Storage has development rules (allow all access)"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} Storage rules appear to be production-ready"
fi

# Check if .env is in .gitignore
if [ -f .gitignore ] && grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✓${NC} .env is properly ignored in .gitignore"
else
    echo -e "${YELLOW}⚠${NC} Warning: .env may not be in .gitignore"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Final summary
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Configuration is valid.${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Configuration valid with $WARNINGS warning(s)${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}❌ Configuration has $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
    echo "Please fix the errors before proceeding."
    echo "Run: ./scripts/switch-env.sh <site-name> to reconfigure"
    exit 1
fi
