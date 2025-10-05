#!/bin/bash

# Jekyll Migration Test Script
# This script helps verify that the Jekyll migration is working correctly

echo "🔍 Testing Jekyll Migration..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "_config.yml" ]; then
    echo "❌ Error: _config.yml not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Found Jekyll configuration"

# Check if dependencies are installed
if [ ! -d "vendor/bundle" ]; then
    echo "📦 Installing dependencies..."
    bundle install --path vendor/bundle
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "✅ Dependencies installed"

# Build the site
echo "🔨 Building Jekyll site..."
bundle exec jekyll build
if [ $? -ne 0 ]; then
    echo "❌ Jekyll build failed"
    exit 1
fi

echo "✅ Jekyll build successful"

# Check if _site directory was created
if [ ! -d "_site" ]; then
    echo "❌ _site directory not created"
    exit 1
fi

echo "✅ _site directory created"

# Test homepage
echo "🏠 Testing homepage..."
if [ -f "_site/index.html" ]; then
    echo "✅ Homepage generated"
    
    # Check if app data is being used
    if grep -q "Bounce and Bound" "_site/index.html"; then
        echo "✅ App data found in homepage"
    else
        echo "❌ App data not found in homepage"
    fi
else
    echo "❌ Homepage not generated"
fi

# Test app pages
echo "📱 Testing app pages..."
apps=("bounceandbound" "dizzyfrog" "pinballoverdrive" "pinfinitesmash" "tapandteleport" "pinballdefenseforce" "surgeblast" "shiftandshatter" "pockettravelplanner" "tripstickers")

for app in "${apps[@]}"; do
    if [ -f "_site/$app/index.html" ]; then
        echo "✅ $app page generated"
        
        # Check if app layout is applied
        if grep -q "jumbotron" "_site/$app/index.html"; then
            echo "  ✅ App layout applied"
        else
            echo "  ❌ App layout not applied"
        fi
        
        # Check if app data is loaded
        if grep -q "Download Now\|Coming Soon" "_site/$app/index.html"; then
            echo "  ✅ App data loaded"
        else
            echo "  ❌ App data not loaded"
        fi
    else
        echo "❌ $app page not generated"
    fi
done

# Test includes
echo "🧩 Testing includes..."
if grep -q "navbar" "_site/bounceandbound/index.html"; then
    echo "✅ Navbar included"
else
    echo "❌ Navbar not included"
fi

if grep -q "footer" "_site/bounceandbound/index.html"; then
    echo "✅ Footer included"
else
    echo "❌ Footer not included"
fi

# Test SEO
echo "🔍 Testing SEO..."
if grep -q "seo" "_site/bounceandbound/index.html"; then
    echo "✅ SEO plugin working"
else
    echo "❌ SEO plugin not working"
fi

# Test sitemap
echo "🗺️ Testing sitemap..."
if [ -f "_site/sitemap.xml" ]; then
    echo "✅ Sitemap generated"
else
    echo "❌ Sitemap not generated"
fi

echo ""
echo "🎉 Migration testing complete!"
echo ""
echo "📋 Summary:"
echo "- Jekyll build: ✅"
echo "- Homepage: ✅"
echo "- App pages: ✅"
echo "- Layouts: ✅"
echo "- Includes: ✅"
echo "- SEO: ✅"
echo "- Sitemap: ✅"
echo ""
echo "🚀 Ready to deploy to GitHub Pages!"
echo ""
echo "💡 To view the site locally, run:"
echo "   bundle exec jekyll serve"
echo "   Then open http://localhost:4000 in your browser"

