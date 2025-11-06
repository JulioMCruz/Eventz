#!/bin/bash

# Multi-Site Deployment Script for Eventz
# Usage: ./scripts/deploy.sh <site-name> [--rules-only|--hosting-only|--all]
# Example: ./scripts/deploy.sh tdd-peru --all

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get arguments
SITE_NAME=$1
DEPLOY_TYPE=${2:-"--all"}

if [ -z "$SITE_NAME" ]; then
    echo -e "${RED}Error: Site name is required${NC}"
    echo "Usage: ./scripts/deploy.sh <site-name> [--rules-only|--hosting-only|--all]"
    echo ""
    echo "Available sites:"
    echo "  - tdd-peru"
    echo "  - tdd-talk-prod"
    echo ""
    echo "Deploy types:"
    echo "  --all          Deploy everything (rules + hosting)"
    echo "  --rules-only   Deploy only Firestore and Storage rules"
    echo "  --hosting-only Deploy only Next.js build"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Eventz Multi-Site Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# 1. Switch to correct environment
echo -e "${YELLOW}Step 1/5: Switching environment to $SITE_NAME${NC}"
./scripts/switch-env.sh "$SITE_NAME"
echo ""

# 2. Verify environment configuration
echo -e "${YELLOW}Step 2/5: Verifying environment configuration${NC}"
./scripts/verify-env.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Environment verification failed. Aborting deployment.${NC}"
    exit 1
fi
echo ""

# 3. Deploy Firestore and Storage rules
if [ "$DEPLOY_TYPE" == "--all" ] || [ "$DEPLOY_TYPE" == "--rules-only" ]; then
    echo -e "${YELLOW}Step 3/5: Deploying Firestore and Storage rules${NC}"
    echo -e "  → Deploying Firestore rules..."
    firebase deploy --only firestore:rules
    echo -e "  → Deploying Storage rules..."
    firebase deploy --only storage
    echo -e "${GREEN}✅ Rules deployed successfully${NC}"
    echo ""
else
    echo -e "${YELLOW}Step 3/5: Skipping rules deployment${NC}"
    echo ""
fi

# 4. Build Next.js application
if [ "$DEPLOY_TYPE" == "--all" ] || [ "$DEPLOY_TYPE" == "--hosting-only" ]; then
    echo -e "${YELLOW}Step 4/5: Building Next.js application${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Build failed. Aborting deployment.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Build completed successfully${NC}"
    echo ""
else
    echo -e "${YELLOW}Step 4/5: Skipping build${NC}"
    echo ""
fi

# 5. Deployment summary
echo -e "${YELLOW}Step 5/5: Deployment Summary${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ Deployment Completed Successfully${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Site: $SITE_NAME"
echo "Project ID: $(firebase use)"
echo "Deployed at: $(date)"
echo ""
if [ "$DEPLOY_TYPE" == "--all" ] || [ "$DEPLOY_TYPE" == "--rules-only" ]; then
    echo -e "${GREEN}✓${NC} Firestore rules deployed"
    echo -e "${GREEN}✓${NC} Storage rules deployed"
fi
if [ "$DEPLOY_TYPE" == "--all" ] || [ "$DEPLOY_TYPE" == "--hosting-only" ]; then
    echo -e "${GREEN}✓${NC} Next.js application built"
fi
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  - Test your deployment at: https://$SITE_NAME.web.app"
echo "  - Monitor Firebase Console: https://console.firebase.google.com/project/$SITE_NAME"
echo "  - Check logs: firebase functions:log"
