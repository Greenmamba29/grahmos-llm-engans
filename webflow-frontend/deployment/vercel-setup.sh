#!/bin/bash

# Grahmos Backend Deployment Script for Vercel
# Run this script to deploy your backend API to Vercel

set -e

echo "🚀 Grahmos Backend Deployment"
echo "=============================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
fi

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

echo ""
echo "🔐 Setting up environment variables..."
echo ""
echo "Please have the following ready:"
echo "  - GROQ_API_KEY"
echo "  - OPENAI_API_KEY"
echo "  - BRAVE_SEARCH_API_KEY"
echo "  - SERPER_API"
echo "  - ALLOWED_ORIGINS (your Webflow domain)"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Note your deployment URL from above"
echo "  2. Set environment variables in Vercel dashboard"
echo "  3. Configure custom domain (optional)"
echo "  4. Update Webflow config.js with your API URL"
echo "  5. Test the API endpoints"
echo ""
echo "🔗 Manage your project: https://vercel.com/dashboard"
echo ""
