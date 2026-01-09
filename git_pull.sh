#!/bin/bash

# Script to pull latest changes from git repository

echo "Pulling latest changes from git repository..."
git pull

if [ $? -eq 0 ]; then
    echo "✓ Git pull completed successfully"
else
    echo "✗ Git pull failed"
    exit 1
fi
