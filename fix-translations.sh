#!/bin/bash
echo "🚀 Running complete translation system fix..."
echo "1. Uploading missing UI keys..."
node scripts/add-ui-missing-keys.js
echo "2. Complete! ✅"