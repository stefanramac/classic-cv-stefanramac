#!/bin/bash

# Create deployment package for cPanel
echo "Creating deployment package..."

# Remove old deployment.zip if exists
rm -f deployment.zip

# Create clean ZIP with only necessary files
zip -r deployment.zip \
    index.html \
    404.html \
    styles.css \
    script.js \
    -x "*.DS_Store" \
    -x "__MACOSX/*"

echo "✅ Deployment package created: deployment.zip"
echo ""
echo "Files included:"
unzip -l deployment.zip
echo ""
echo "📦 Ready to upload to cPanel!"
echo ""
echo "⚠️  If you get a virus warning, upload files individually via File Manager or use FTP."

