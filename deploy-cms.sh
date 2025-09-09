#!/bin/bash

echo "🚀 Monica Leggett CMS Deployment Script"
echo "======================================="

# Option 1: Deploy as separate site
deploy_separate() {
    echo "📦 Building Sanity Studio..."
    cd studio
    npm run build
    
    echo "🌐 Ready for Netlify deployment!"
    echo ""
    echo "To deploy:"
    echo "1. Go to netlify.com and create new site"
    echo "2. Connect to this repository"
    echo "3. Set build directory to: studio"
    echo "4. Netlify will use the netlify.toml configuration"
    echo ""
    echo "OR use Netlify CLI:"
    echo "cd studio && netlify deploy --prod"
}

# Option 2: Deploy to main site at /admin
deploy_to_main_site() {
    echo "📦 Building Sanity Studio..."
    cd studio
    npm run build
    
    echo "📁 Copying Studio to main site..."
    cd ..
    
    # Create admin directory in main site
    mkdir -p public/admin
    
    # Copy built studio files
    cp -r studio/dist/* public/admin/
    
    echo "✅ Studio copied to public/admin/"
    echo "📦 Building main site..."
    
    npm run build
    
    echo "🌐 Ready for main site deployment!"
    echo "CMS will be available at: yoursite.com/admin"
}

echo "Choose deployment option:"
echo "1) Separate CMS site (cms.yoursite.com)"
echo "2) Add to main site (/admin path)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        deploy_separate
        ;;
    2)
        deploy_to_main_site
        ;;
    *)
        echo "Invalid choice. Run script again."
        ;;
esac