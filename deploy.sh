#!/bin/bash
set -e

PROJECT_DIR="/root/projects/lastwin/last-win"
DEPLOY_DIR="/var/www/otrom.fr/html/lastwin"

echo "📦 Build..."
cd "$PROJECT_DIR"
npx expo export --platform web

echo "🚀 Deploy..."
rm -rf "$DEPLOY_DIR"/*
cp -r dist/* "$DEPLOY_DIR"/

echo "✅ Done — https://otrom.fr/lastwin"
