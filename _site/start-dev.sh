#!/bin/bash

# Jekyll Development Server Startup Script
# This script starts the Jekyll development server with live reload

echo "🚀 Starting Jekyll development server..."
echo "📍 Site will be available at: http://localhost:4000"
echo "🔄 Live reload is enabled"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Check if bundle is installed
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundle not found. Please install Ruby and Bundler first."
    echo "   Run: gem install bundler"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "vendor/bundle" ]; then
    echo "📦 Installing dependencies..."
    bundle install
fi

# Start Jekyll server with live reload
echo "🔥 Starting server with live reload..."
bundle exec jekyll serve --livereload --incremental --drafts --unpublished
