#!/bin/bash

echo "Installing..."
npm install
npm audit fix

echo "Edit the .env file and set the broker endponts and credentials..."
sleep 3
nano .env
echo "Good luck!"