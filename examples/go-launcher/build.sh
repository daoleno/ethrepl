#!/bin/bash

# Navigate to the project root
cd ../..

# Ensure the dist directory exists
mkdir -p dist

# Build the ethrepl bundle
npm run build

# Copy the bundle to the go-launcher directory
cp dist/bundle.js examples/go-launcher/ethrepl.js

# Navigate to the go-launcher directory
cd examples/go-launcher

# Initialize Go module if go.mod doesn't exist
if [ ! -f "go.mod" ]; then
    go mod init github.com/daoleno/ethrepl/examples/go-launcher
fi

# Build the Go program
go build -o ethrepl-launcher

echo "ethrepl-launcher built successfully"
